module.exports = function(app, db, checkAuth){

    var urlParser = require('url');
    var fs = require("node-fs");
    var make_uuid = require('node-uuid');
    var cmd = require('child_process');
    var config = require("./config");

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
        var url = req.body.url;
        var domain = getDomain(url);

        db.query('CALL register_domain(?);', [domain], function(err, docs) {
            if(err) {
                console.log(err);
                res.status(500);
                res.json({error:"Error registering domain: " + domain});
            } else {
                res.status(200);
                res.json({succes: "Success"});
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
            } else {
                res.status(200);
                res.json({succes: "Success"});
            }
        });

    });

    function createPath(callback){
        var error;

        var uuid = make_uuid.v1();

        var created_path = base_clickjacker_dir + "/public/archive/" + uuid;

        console.log("Creating archive path: " + created_path)

        fs.mkdir(created_path, function (err) {
            if(err) {
                console.log(err);
                error = "Server error making archive directory."
            }
            callback(created_path, uuid, error);
        });
    }


    function saveLanderToDB(user, uuid, download_path, callback) {
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
            db.query("INSERT INTO landers(uuid, original_archive_path, user, last_updated) VALUES(?, ?, ?, NOW());", [uuid, download_path, user], function(err2, docs) {
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
        var archive_path;                
        var zip_name=req.files.myFile.originalname; 
        //var zip_name=req.files.myFile.name
        var lander_id;
        var uuid;
        var download_path;

        createPath(function(archive_path, uuid, error) {
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
                saveLanderToDB(user, uuid, download_path, function(lander_id, error) {
                    if(error) {
                        console.log(error);
                        res.status(500);
                        res.send(error);
                        return;
                    }

                    var response = {
                      download : download_path,
                      uuid : uuid,
                      lander_id : lander_id
                    };

                    res.status(200);
                    res.send(response);

                }); 
            }); 
        });
    });

}