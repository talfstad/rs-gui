module.exports = function(app, db, checkAuth){

    var urlParser = require('url');
    var fs = require("node-fs");
    var make_uuid = require('node-uuid');
    var cmd = require('child_process');
    var config = require("./config");
    var mkdirp = require("mkdirp");

    var base_clickjacker_dir = config.base_clickjacker_dir;

    //this will probably work on ubuntu but it doesn't work on my windows for some reason
    // cmd.exec('cd .. ; pwd', function (err, stdout, stderr) {
    //         if(err) {
    //             console.log(stderr);
    //             error = "Error getting the working directory"
    //         }
    //         console.log("base dir is: " + base_clickjacker_dir);
    //         base_clickjacker_dir = stdout;
    //  });

    function getDomain(url) {
        return urlParser.parse(url).hostname;
    }

    app.post("/register_domain", checkAuth, function(req, res) {  
        var user = req.signedCookies.user_id;  
        var url = req.body.url;
        var domain = getDomain(url);

        if(req.signedCookies.admin == 'true') {
            db_query = 'CALL register_domain(\''+domain+'\');';
        }
        else {
            db_query = 'CALL register_domain_by_user(\''+domain+'\'' + ',\'' +user+'\');';
        }

        db.query(db_query, function(err, docs) {
            if(err) {
                console.log(err);
                res.status(500);
                res.json({error:"Error registering domain: " + domain});
            } else {
                res.status(200);
                res.json({success: "Success"});
            }
        });

    });

    app.post("/unregister_domain", checkAuth, function(req, res) { 
        var user = req.signedCookies.user_id;
        var url = req.body.url;
        var domain = getDomain(url);

        if(req.signedCookies.admin == 'true') {
            db_query = 'CALL unregister_domain(\''+domain+'\');';
        }
        else {
            db_query = 'CALL unregister_domain_by_user(\''+domain+'\'' + ',\'' +user+'\');';
        }

        db.query(db_query, function(err, docs) {
            if(err) {
                console.log(err);
                res.status(500);
                res.json({error:"Error unregistering domain: " + domain});
            } else {
                res.status(200);
                res.json({success: "Success"});
            }
        });

    });

    app.get("/get_landers", checkAuth, function(req, res) {
        var user = req.signedCookies.user_id; 

        if(req.signedCookies.admin == 'true') {
            db_query = 'SELECT * FROM landers';
        }
        else {
            db_query = "SELECT * FROM landers WHERE user = '" + user + "';";
        }

        db.query(db_query, function(err, docs) {
            if (err) {
                console.log(err);
                res.status(500);
                res.json({error:"Internal server error looking up the landers."});
            } else {          
                if(docs) {
                    res.status(200);
                    res.json(docs);
                }
                else {
                    res.status(500);
                    res.json({error:"Internal server error looking up the landers."});
                }
            }
        });

    });

    function createPath(path, callback){
        var error;

        console.log("Creating archive path: " + path)

        mkdirp(path, function (err) {
            if(err) {
                console.log(err);
                error = "Server error making archive directory."
            }
            callback(created_path, uuid, error);
        });
    }


    function saveLanderToDB(user, uuid, download_path, notes, callback) {
        var error;
        var lander_id;

        db.query("CALL get_lander_id(?, ?);", [user, uuid], function(err, docs) {
            if(err) {
                error = err;
            }
            else {
                if(docs[0]) {
                    lander_id=docs[0][0].id;
                } 
                console.log("Created lander id: " + lander_id + " with UUID: " + uuid);
            }
            db.query("INSERT INTO landers(uuid, original_archive_path, user, notes, last_updated) VALUES(?, ?, ?, ?, NOW());", [uuid, download_path, notes, user], function(err2, docs) {
                if(err2) {
                    error = err2;
                }
                callback(lander_id, error)
            });
        });
    }

    function archiveOriginalLander(file_path, archive_path, zip_name, callback) {
        var error;

        console.log("Copying " + file_path + " to " + archive_path + "/" + zip_name);

        fs.rename(
            file_path,
            archive_path + "/" + zip_name,
            function(err) {
                if(err) {
                    console.log(err);
                    error = 'Server error writing file.'
                }
                callback(archive_path + "/" + zip_name, error);
            }
        );
        
    }

    app.post('/upload', checkAuth, function(req, res) {
     
        var user = req.signedCookies.user_id;              
        var zip_name = req.files.myFile.originalname;
        //var zip_name=req.files.myFile.name
        var notes = req.body.notes;
        var lander_id;
        var uuid = make_uuid.v1();
        var archive_path = base_clickjacker_dir + "/archive/" + uuid;
        var download_path;
        var download_url = "/download_original_lander?uuid=";

        mkdirp(archive_path, function(error) { 
            if(error) {
                console.log(error);
                res.status(500);
                res.send(error);
                return;
            }
            archiveOriginalLander(req.files.myFile.path, archive_path, zip_name, function(download_path, error) {
                if(error) {
                    console.log(error);
                    res.status(500);
                    res.send(error);
                    return;
                }
                saveLanderToDB(user, uuid, download_path, notes, function(lander_id, error) {
                    if(error) {
                        console.log(error);
                        res.status(500);
                        res.send(error);
                        return;
                    }

                    var response = {
                      download_url : download_url + uuid,
                      uuid : uuid,
                      lander_id : lander_id,
                      notes : notes
                    };

                    res.status(200);
                    res.send(response);

                }); 
            }); 
        });
    });


    function archiveInstalledLander(file_path, archive_path, zip_name, callback) {
        var error;

        console.log("Copying " + file_path + " to " + archive_path + "/" + zip_name);

        fs.rename(
            file_path,
            archive_path + "/" + zip_name,
            function(err) {
                if(err) {
                    console.log(err);
                    error = 'Server error writing file.'
                }
                callback(archive_path + "/" + zip_name, error);
            }
        );
        
    }

    function saveInstalledLanderToDB(uuid, download_path, callback) {
        var error;
        var lander_id;

        db.query("UPDATE landers SET installed_archive_path = ?, ready = 1 WHERE uuid = ?;", [download_path, uuid], function(err, docs) {
            if(err) {
                error = err;
            }
            callback(error)
        });

    }

    app.post('/upload_installed', checkAuth, function(req, res) {

        if(req.signedCookies.admin != 'true') {
            console.log("Only admins are authorized for upload_installed.");
            res.status(401);
            res.send({error : "Not authorized"});
            return;     
        }

        var user = req.signedCookies.user_id;              
        var zip_name = req.files.myFile.originalname;
        //var zip_name=req.files.myFile.name
        var lander_id;
        var uuid = req.body.uuid;
        var archive_path = base_clickjacker_dir + "/archive/" + uuid + "/installed";
        var download_path;
        var download_url = "/download_installed_lander?uuid=" + uuid;

        mkdirp(archive_path, function(error) { 
            if(error) {
                console.log(error);
                res.status(500);
                res.send(error);
                return;
            }
            archiveInstalledLander(req.files.myFile.path, archive_path, zip_name, function(download_path, error) {
                if(error) {
                    console.log(error);
                    res.status(500);
                    res.send(error);
                    return;
                }
                saveInstalledLanderToDB(uuid, download_path, function(error) {
                    if(error) {
                        console.log(error);
                        res.status(500);
                        res.send(error);
                        return;
                    }

                    var response = {
                      download_url : download_url,
                    };

                    res.status(200);
                    res.send(response);

                }); 
            }); 
        });     
    });

}