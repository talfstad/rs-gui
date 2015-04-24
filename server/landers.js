module.exports = function(app, db, checkAuth){

    var urlParser = require('url');
    var fs = require("node-fs");
    var uuid = require('node-uuid');
    var cmd = require('child_process');

    var base_clickjacker_dir;

    //this will probably work on ubuntu but it doesn't work on my windows for some reason
    cmd.exec('cd .. ; pwd', function (err, stdout, stderr) {
            if(err) {
                console.log(stderr);
                error = "Error getting the working directory"
            }
            console.log("base dir is: " + base_clickjacker_dir);
            base_clickjacker_dir = stdout;
     });

    function getDomain(url) {
        return urlParser.parse(url).hostname;
    }

    app.post("/register_domain", checkAuth, function(req, res) {    
        var url = req.body.url;
        var domain = getDomain(url);

        db.query('CALL register_domain(?);', [domain], function(err, docs) {
            if(err) {
                console.log(err);
                res.status(500);
                res.json({error:"Error registering domain: " + domain});
            }
        });

    });

    app.post("/unregister_domain", checkAuth, function(req, res) {  
        var url = req.body.url;
        var domain = getDomain(url);

        db.query('CALL unregister_domain(?);', [domain], function(err, docs) {
            if(err) {
                console.log(err);
                res.status(500);
                res.json({error:"Error unregistering domain: " + domain});
            }
        });

    });

    function createPath(unique_zip_name, callback){
        var error;

        var unique_str = unique_zip_name.split('.')[0];

        var staging_path = "/staging/" + unique_str;
        var created_path =  base_clickjacker_dir + staging_path;

        console.log("Creating staging path: " + created_path)

        //make dir here
        var mkdir_cmd = 'mkdir -p ' + created_path;
        cmd.exec(mkdir_cmd, function (err, stdout, stderr) {
            if(err) {
                console.log(stderr);
                error = "Server error making staging directory."
            }
            callback(created_path, error);
        });
    }

    function stageFile(file_path, staging_path, zip_name, callback) {
        var error;

        //req.files.myFile.path

        console.log("Copying " + file_path + " to " + staging_path + "/" + zip_name);

        fs.rename(
            file_path,
            staging_path + "/" + zip_name,
            function(err) {
                if(err) {
                    console.log(err);
                    error = 'Server error writing file.'
                }
                callback(error);
            }
        );
    }



    function rezipAndArchive(staging_path, zip_name, lander_uuid, user, callback) {
        var error;

        var archive_path = base_clickjacker_dir + "/public/archive/" + user + "/" + lander_uuid + "/";

        var mkdir_cmd = "mkdir -p " + archive_path;
        var zip_cmd = "cd " + staging_path + " && zip -r " + archive_path + zip_name + " *";

        console.log("Archiving " + staging_path + "/* to " + archive_path + zip_name);

        cmd.exec(mkdir_cmd, function (err1, stdout, stderr) {
            if(err1) {
                console.log(stderr);
                error = "Error creating archive directory";
                callback(archive_path + zip_name, error);
            }

            cmd.exec(zip_cmd, function (err2, stdout, stderr) {
                if(err2) {
                    console.log(stderr);
                    error = "Error archiving zip file.";
                }
                db.query("UPDATE lander_info SET archive_path = ? WHERE (uuid = ?);", [archive_path + zip_name, lander_uuid], function(err2, docs) {
                    if(err2) {
                        error = "Could save archive path for lander uuid = " + lander_uuid;
                    }
                    callback(archive_path + zip_name, error);
                });
            });
        });
    }

    app.post('/upload', checkAuth, function(req, res) {
     
        var user = req.signedCookies.user_id;
        var lander_path;                
        var zip_name=req.files.myFile.originalname; 
        var lander_id;
        var lander_uuid;

        createPath(req.files.myFile.name, function(lander_path, error) {
            if(error) {
                console.log(error);
                res.status(500);
                res.send(error);
                return;
            }
            else {
                zip_path=original_lander_path;
            }

            archiveOriginalFile(req.files.myFile.path, original_lander_path, zip_name, function(error) {
                if(error) {
                    console.log(error);
                    res.status(500);
                    res.send(error);
                    return;
                }

                getLanderId(user, function(lander_id, lander_uuid, error) {
                    if(error) {
                        console.log(error);
                        res.status(500);
                        res.send(error);
                        return;
                    }

                    var response = {
                      download : original_lander_path,
                      lander_uuid : lander_uuid,
                      lander_id : lander_id
                    };

                    res.send(response);

                }); //getLanderId
            }); //stageFile
        });
    });

    function getLanderId(user, callback) {
        var error;
        var lander_id;

        var lander_uuid = uuid.v1();

        db.query("CALL get_lander_id(?, ?);", [user, lander_uuid], function(err, docs) {
            if(err) {
                error = err;
            }
            else {
                if(docs[0]) {
                    lander_id=docs[0][0].id;
                } 
                console.log("Created lander id: " + lander_id + " with UUID: " + lander_uuid);
            }
            callback(lander_id, lander_uuid, error)
        });
    }

    function archiveOriginalLander(file_path, zip_name, uuid, callback) {
        var error;
        var archive_path = base_clickjacker_dir + "/public/archive/" + uuid;

        var mkdir_cmd = "mkdir -p " + archive_path;

        cmd.exec(mkdir_cmd, function (err1, stdout, stderr) {
            if(err1) {
                console.log(stderr);
                error = "Error creating archive directory";
                callback(archive_path + "/" + zip_name, error);
            }
            else {
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
        });
    }

    app.post('/upload', checkAuth, function(req, res) {
        var user = req.signedCookies.user_id;
        var zip_file = req.files.myFile.path;
        var zip_file_name = req.files.myFile.name;
        var archive_path;
        var lander_id;
        var lander_uuid;

        getLanderId(user, function(lander_id, lander_uuid, error) {
            if(error) {
                console.log(error);
                res.status(500);
                res.send(error);
                return;
            }

            archiveOriginalLander(zip_file, zip_file_name, uuid, function(archive_path, error) {
                if(error) {
                    console.log(error);
                    res.status(500);
                    res.send(error);
                    return;
                }

                db.query("CALL insert_lander(?, ?, ?);", [user, lander_uuid, archive_path], function(err, docs) {
                    if (err) {
                        console.log(err);
                        res.status(500);
                        res.json({error: "Internal server error inserting lander with uuid: " + lander_uuid});
                    } else {       
                        var response = {
                          download : archive_path,
                          lander_uuid : lander_uuid,
                          lander_id : lander_id
                        };

                        res.status(200);
                        res.send(response);
                    }
                });
            });
        });

    });  

}