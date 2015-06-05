module.exports = function(app, db, checkAuth){

    var urlParser = require('url');
    var fs = require('node-fs');
    var make_uuid = require('node-uuid');
    var cmd = require('child_process');
    var config = require('./config');
    var mkdirp = require('mkdirp');
    var path = require('path');
    var s3 = require('s3');

    var s3_client = s3.createClient({
        maxAsyncS3: 20,     // this is the default
        s3RetryCount: 3,    // this is the default
        s3RetryDelay: 1000, // this is the default
        multipartUploadThreshold: 20971520, // this is the default (20 MB)
        multipartUploadSize: 15728640, // this is the default (15 MB)
        s3Options: {
            accessKeyId: "AKIAI466DJECC35NREIA",
            secretAccessKey: "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",
            // any other options are passed to new AWS.S3()
            // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Config.html#constructor-property
        },
    });

    var bucket_name = "buildcavelanders";

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


    function saveLanderToDB(user, uuid, download_url, notes, callback) {
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
            db.query("INSERT INTO landers(uuid, original_url, user, notes, last_updated) VALUES(?, ?, ?, ?, NOW());", [uuid, download_url, user, notes], function(err2, docs) {
                if(err2) {
                    error = err2;
                }
                callback(lander_id, error)
            });
        });
    }

    function archiveLander(file_path, bucket_path, zip_name, callback) {
        var error;

        var download_url = "https://s3-us-west-2.amazonaws.com/" + bucket_name + "/" + bucket_path;

        var bucket_params = {
          localFile: file_path,

          s3Params: {
            Bucket: bucket_name,
            Key: bucket_path,
            ACL: "public-read"
            // other options supported by putObject, except Body and ContentLength.
            // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putObject-property
          },
        };

        //console.log("Copying " + file_path + " to " + archive_path + "/" + zip_name);
        console.log("Uploading to s3 bucket: " + bucket_name + "/" + bucket_path)

        var uploader = s3_client.uploadFile(bucket_params);

        uploader.on('error', function(err) {
            error = "Unable to upload:" + err.stack;
            callback(download_url, error)
            return;
        });

        uploader.on('progress', function() {
          //console.log("Upload Progress: ", uploader.progressMd5Amount, uploader.progressAmount, uploader.progressTotal);
        });

        uploader.on('end', function() {
          console.log("Done uploading.");
          callback(download_url, error);
          return;
        });
        
    }

    app.post("/edit_notes", checkAuth, function(req, res) {
        var user = req.signedCookies.user_id;
        var uuid = req.body.uuid;
        var notes = req.body.notes;

        if(req.signedCookies.admin == 'true') {
            db_query = "UPDATE landers SET notes = '" + notes + "' WHERE uuid = '" + uuid + "';";
        }
        else {
            db_query = "UPDATE landers SET notes = '" + notes + "' WHERE uuid = '" + uuid + "' AND user = '" + user + "';";
        }

        db.query(db_query, function(err, docs) {
            if(err) {
                console.log(err);
                res.status(500);
                res.json({error:"Error editing notes for lander with uuid = " + uuid});
            } else {
                res.status(200);
                res.json({success: "Success"});
            }
        });

    });

    app.post('/upload', checkAuth, function(req, res) {
     
        var user = req.signedCookies.user_id;    
        var file = req.files['files[]'];          
        var zip_name = file.originalname;
        //var zip_name=req.files.myFile.name
        var notes = req.body.notes;

        var lander_id;
        var uuid = make_uuid.v4();
        var secret_uuid = make_uuid.v4();
        var archive_path = "original/" + user + "/" + uuid + "/" + secret_uuid + "/" + zip_name;
        var download_path;
        var download_url;

        archiveLander(file.path, archive_path, zip_name, function(download_url, error) {
            if(error) {
                console.log(error);
                res.status(500);
                res.send({error : "Error saving lander to S3."});
                return;
            }
            saveLanderToDB(user, uuid, download_url, notes, function(lander_id, error) {
                if(error) {
                    console.log(error);
                    res.status(500);
                    res.send({error : "Error saving lander to S3."});
                    return;
                }

                var response = {
                  original_url : download_url,
                  uuid : uuid,
                  lander_id : lander_id,
                  notes : notes,
                };
                
                res.status(200);
                res.send(response);

            }); 
        }); 

    });

    function saveInstalledLanderToDB(uuid, download_url, callback) {
        var error;
        var lander_id;

        db.query("UPDATE landers SET installed_url = ?, ready = 1 WHERE uuid = ?;", [download_url, uuid], function(err, docs) {
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
        var lander_id;
        var uuid = req.body.uuid;
        var secret_uuid = make_uuid.v4();
        var archive_path = "installed/" + user + "/" + uuid + "/" + secret_uuid + "/" + zip_name;
        var download_path;
        var download_url;

        archiveLander(file.path, archive_path, zip_name, function(download_url, error) {
            if(error) {
                console.log(error);
                res.status(500);
                res.send({error : "Error saving lander to S3."});
                return;
            }
            saveInstalledLanderToDB(uuid, download_url, function(error) {
                if(error) {
                    console.log(error);
                    res.status(500);
                    res.send({error : "Error saving lander to S3."});
                    return;
                }

                var response = {
                  installed_url : download_url,
                  uuid : uuid,
                  lander_id : lander_id,
                  notes : notes,
                  files: [
                      {
                        name: file.originalname,
                        size: file.size,
                        url: download_url
                      }
                    ]
                };
                
                res.status(200);
                res.send(response);

            }); 
        });    
    });

}