
//module dependencies
var express = require("express")
  , http = require("http")
  , mysql = require("mysql")
  , path = require("path")
  , app = express()
  , _ = require("underscore")
  , config = require("./config")
  , utils = require("./utils")
  , validator = require("validator")
  , bcrypt = require("bcrypt-nodejs")
  , randomstring = require("randomstring")
  , urlParser = require("url")
  , methodOverride = require("method-override")
  , bodyParser = require("body-parser")
  , fs = require("node-fs")
  , mustache = require("mustache")
  // , pause = require('connect-pause')
  , moment = require('moment');

app.use(function logErrors(err, req, res, next) {
  console.error(err.stack);
  next(err);
});

// Compression (gzip)
app.use(express.compress() );
app.use(express.bodyParser());
app.use(express.urlencoded({extended:true}));            // Needed to parse POST data sent as JSON payload
app.use(bodyParser.json());

// Cookie config
app.use( express.cookieParser( config.cookieSecret ) );           // populates req.signedCookies
app.use( express.cookieSession( config.sessionSecret ) );         // populates req.session, needed for CSRF

// We need serverside view templating to initially set the CSRF token in the <head> metadata
// Otherwise, the html could just be served statically from the public directory
app.set('view engine', 'html');
app.set('views', __dirname + '/' );
app.engine('html', require('hbs').__express);

app.use(express.static(__dirname + '/../public'));
app.use(express.csrf());

//app.use(app.router);

var db = mysql.createConnection(config.dbConnectionInfo);
db.connect();

function checkAuth(req, res, next){
  db.query("SELECT * FROM users WHERE user = ? AND auth_token = ?", [ req.signedCookies.user_id, req.signedCookies.auth_token ], function(err, rows) {
    if(rows.length == 1) {
        next();
    } else {
        res.json({error: "You are not authenticated"});
    }
  });
};

app.get("/", function(req, res) {
    res.render('index', { csrfToken: req.csrfToken() });
});

app.get("/api/rips", checkAuth, function(req, res, next) {
    db.query("select ripped.id, ripped.hits, ripped.url, ripped.links_list, ripped.replacement_links, pulse.period_start, pulse.rate from ripped, pulse where pulse.url = ripped.url ORDER BY rate DESC, period_start DESC", [] , function(err, rows) {
        if(rows.length >= 1) {
            res.json(rows);
        } else { 
            res.json({ error: "There are no rips yet!"  });   
        }
    });
});

// GET /api/auth
// @desc: checks a user's auth status based on cookie
app.get("/api/auth", function(req, res) {
    db.query("SELECT * FROM users WHERE user = ? AND auth_token = ?", [ req.signedCookies.user_id, req.signedCookies.auth_token ], function(err, rows) {
        if(rows.length == 1) {
            var row = rows[0];
            res.json({ user: _.omit(row, config.userDataOmit) });   
        } else { 
            res.json({ error: "Client has no valid login cookies."  });   
        }
    });
});

// POST /api/auth/login
// @desc: logs in a user
app.post("/api/auth/login", function(req, res) {  
    db.query("SELECT * FROM users WHERE user = ?", [ req.body.username ], function(err, rows) {
        if(rows.length == 1) {
            var row = rows[0];
            
            // Compare the POSTed password with the encrypted db password
            if(bcrypt.compareSync( req.body.password, row.hash)) {
                
                if(!row.approved) {
                    res.json({error: "Your account isn't activated yet."});
                } else {
                    res.cookie('user_id', row.user, { signed: true, maxAge: config.cookieMaxAge  });
                    res.cookie('auth_token', row.auth_token, { signed: true, maxAge: config.cookieMaxAge  });

                    if(row.admin == 1) {
                        res.cookie('admin', 'true', { signed: true, maxAge: config.cookieMaxAge  });
                    }
                    else {
                        res.cookie('admin', 'false', { signed: true, maxAge: config.cookieMaxAge  });
                    }

                    // Correct credentials, return the user object
                    res.json({ user: _.omit(row, config.userDataOmit) });
                }
            } else {
                // Username did not match password given
                res.json({ error: "Invalid username or password."  });   
            }
        } else {
            // Could not find the username
            res.json({ error: "Username does not exist."  });   
        }
    });

});

// POST /api/auth/signup
// @desc: creates a user
app.post("/api/auth/signup", function(req, res) {
    
    var secretUsername = randomstring.generate(30);
    var secretNotUnique = true;
    //ensure unique string
    db.query("SELECT secret_username FROM users;", function(err, docs) {
        for(var i=0 ; i<docs.length ; i++) {
            if(secretUsername == docs[i]) {
                secretUsername = randomstring.generate(30);
                i=0; //start over
            }
        }
    });

    db.query("INSERT INTO users(user, hash, approved, secret_username, auth_token) VALUES (?, ?, ?, ?, ?)",
            [req.body.username, bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8)), 0, secretUsername, bcrypt.genSaltSync(8)], function(err, rows) {
        if(err) {
            console.log(err);
            res.json({ error: "Username has been taken.", field: "username" }); 
        } else {
            // Retrieve the inserted user data
            db.query("SELECT * FROM users WHERE user = ?", [ req.body.username ], function(err, rows) {
                if(rows.length == 1) {
                    var row = rows[0];
                    // Set the user cookies and return the cleansed user data
                    res.cookie('user_id', row.user, { signed: true, maxAge: config.cookieMaxAge  });
                    res.cookie('auth_token', row.auth_token, { signed: true, maxAge: config.cookieMaxAge  });
                    res.cookie('admin', 'false', { signed: true, maxAge: config.cookieMaxAge  });
                    res.json({ user: _.omit(row, config.userDataOmit) });   
                } else {
                    console.log(err, rows);
                    res.json({ error: "Error while trying to register user." }); 
                }
            });
        }
    });
  
});

// POST /api/auth/logout
// @desc: logs out a user, clearing the signed cookies
app.post("/api/auth/logout", function(req, res) {
    
    var user = req.signedCookies.user_id;
    var datetime = utils.toMysqlFormat(new Date());
    db.query('UPDATE users SET last_login = ? WHERE users.user = ?;', [datetime, user], function(err, docs) {
        if(err) throw err;
    });

    res.clearCookie('user_id');
    res.clearCookie('auth_token');
    res.clearCookie('admin');
    res.json({ success: "User successfully logged out." });
});

// POST /api/auth/remove_account
// @desc: deletes a user
/*
app.post("/api/auth/remove_account", function(req, res) {
    db.query("DELETE FROM users WHERE user = ? AND auth_token = ?", [ req.signedCookies.user_id, req.signedCookies.auth_token ], function(err, rows) {
        if(err) {
            res.json({ error: "Error while trying to delete user." }); 
        } else {
            res.clearCookie('user_id');
            res.clearCookie('auth_token');
            res.json({ success: "User successfully deleted." });
        }
    });
});
*/

app.get('/daily_stats', checkAuth, function (req, res) {

    var user = req.signedCookies.user_id;

    var db_query = '';
    if(req.signedCookies.admin == 'true') {
        db_query = 'SELECT daily_stats.*,get_country_distribution(url) AS country_dist FROM daily_stats ORDER BY url;';
    }
    else {
        db_query = 'SELECT daily_stats.*,get_country_distribution(url) AS country_dist FROM daily_stats WHERE user = \'' + user + '\' ORDER BY url;';
    }

    db.query(db_query, function(err, docs) {
        if (err) {
            console.log(err);
            res.status(500);
            res.json({error: "Internal server error looking up the daily stats."});
        } else {
            res.status(200);
            res.json({rows:docs});
        }
    });

});

app.get('/hourly_stats', checkAuth, function (req, res) {

    var url = req.query.url;
    var user = req.signedCookies.user_id;

    var db_query = '';
    if(req.signedCookies.admin == 'true') {
        db_query = 'SELECT * FROM hourly_stats WHERE url = \'' + url + '\';';
    }
    else {
        db_query = 'SELECT * FROM hourly_stats WHERE user = \'' + user + '\' AND url = \'' + url + '\' ORDER BY url;';
    }

    db.query(db_query, function(err, docs) {
        if (err) {
            console.log(err);
            res.status(500);
            res.json({error: "Internal server error looking up the daily stats."});
        } else {       

            if(docs[0] && docs[0].hits_list) {
                var hits_list = docs[0].hits_list;
                hits_list = fillZeroHours(hits_list);

                docs[0].hits_list = hits_list;

                res.status(200);
                res.json(docs[0]);
            }
            else {
                res.status(200);
                res.json(docs[0]);
            }
        }
    });
});

app.get('/all_archive_stats', checkAuth, function (req, res) {

    var user = req.signedCookies.user_id;

    var db_query = '';
    if(req.signedCookies.admin == 'true') {
        db_query = 'SELECT * FROM daily_stats_archive ORDER BY url;';
    }
    else {
        db_query = 'SELECT * FROM daily_stats_archive WHERE user = \'' + user + '\' ORDER BY url;';
    }

    db.query(db_query, function(err, docs) {
        if (err) {
            console.log(err);
            res.status(500);
            res.json({error: "Internal server error looking up the daily stats."});
        } else {
            res.status(200);
            res.json({rows:docs});
        }
    });
});

app.get('/archive_stats', checkAuth, function (req, res) {

    var url = req.query.url;
    var user = req.signedCookies.user_id;

    var db_query = '';
    if(req.signedCookies.admin == 'true') {
        db_query = 'SELECT * FROM daily_stats_archive WHERE url = \'' + url + '\';';
    }
    else {
        db_query = 'SELECT * FROM daily_stats_archive WHERE user = \'' + user + '\' AND url = \'' + url + '\';';
    }

    db.query(db_query, function(err, docs) {
        if (err) {
            console.log(err);
            res.status(500);
            res.json({error: "Internal server error looking up the archive stats."});
        } else {       
            res.status(200);
            res.json(docs[0]);
        }
    });
});

app.get('/ripped_hits_for_n_days', checkAuth, function (req, res) {

    var days = req.query.n;
    var user = req.signedCookies.user_id;

    var ret_arr = [];
    var ret_obj = [];

    var db_query = '';
    if(req.signedCookies.admin == 'true') {
        db_query = 'SELECT hits_list FROM daily_stats_archive WHERE registered = 0;';
    }
    else {
        db_query = 'SELECT hits_list FROM daily_stats_archive WHERE user = \'' + user + '\' AND registered = 0;';
    }

    if(days > 0) {
        db.query(db_query, function(err, docs) {
            if (err) {
                console.log(err);
                res.status(500);
                res.json({error: "Internal server error looking up the hits list from archive stats."});
            } else {       

                for (var i = 0; i < docs.length; i++) {
                    var hits_list = docs[i].hits_list;
                    var hits_arr = hits_list.split(',');
                    hits_arr = hits_arr.reverse();
                    for (var j = 0; j < days; j++) {
                        if(!ret_arr[j]) {
                            ret_arr[j] = 0;
                        }
                        if(hits_arr[j]) {
                            ret_arr[j] += Number(hits_arr[j]);
                        }
                    };
                };
                for (var i = 0; i < ret_arr.length; i++) {
                    var d = moment().subtract(i + 1, 'days').format('YYYY-MM-DD');
                    ret_obj[i] = {day:d, hits:ret_arr[i]};
                };
                res.status(200);
                res.json(ret_obj);
            }
        });
    } else {
        res.status(400);
        res.json({error: "Days must be greater than 0."});
    }
});

app.get('/jacks_for_n_days', checkAuth, function (req, res) {

    var days = req.query.n;
    var user = req.signedCookies.user_id;

    var ret_arr = [];
    var ret_obj = [];

    var db_query = '';
    if(req.signedCookies.admin == 'true') {
        db_query = 'SELECT jacks_list FROM daily_stats_archive WHERE registered = 0;';
    }
    else {
        db_query = 'SELECT jacks_list FROM daily_stats_archive WHERE user = \'' + user + '\' AND registered = 0;';
    }

    if(days > 0) {
        db.query(db_query, function(err, docs) {
            if (err) {
                console.log(err);
                res.status(500);
                res.json({error: "Internal server error looking up the jacks list from archive stats."});
            } else {       

                for (var i = 0; i < docs.length; i++) {
                    var jacks_list = docs[i].jacks_list;
                    var jacks_arr = jacks_list.split(',');
                    jacks_arr = jacks_arr.reverse();
                    for (var j = 0; j < days; j++) {
                        if(!ret_arr[j]) {
                            ret_arr[j] = 0;
                        }
                        if(jacks_arr[j]) {
                            ret_arr[j] += Number(jacks_arr[j]);
                        }
                    };
                };
                for (var i = 0; i < ret_arr.length; i++) {
                    var d = moment().subtract(i + 1, 'days').format('YYYY-MM-DD');
                    ret_obj[i] = {day:d, hits:ret_arr[i]};
                };
                res.status(200);
                res.json(ret_obj);
            }
        });
    } else {
        res.status(400);
        res.json({error: "Days must be greater than 0."});
    }
});

//prepends 0's to the hourly stats hits list for 
function fillZeroHours(hits_list) {
    var curr_hour = moment().toArray()[3];

    hits_list = hits_list.substring(1, hits_list.length); //remove preceding ',' that every list has
    hits_arr = hits_list.split(',');

    var zeros_needed = curr_hour - hits_arr.length;

    for (var i = 0; i < zeros_needed; i++) {
        hits_list = '0,' + hits_list;
    };

    return hits_list;
}

app.get('/ripped', checkAuth, function (req, res) {

    var user = req.signedCookies.user_id;

    var db_query = '';

    if(req.signedCookies.admin == 'true') {
        db_query = 'CALL get_ripped_data();';
    }
    else {
        db_query = 'CALL get_ripped_data_by_user( \'' + user +'\');';
    }

    db.query(db_query, function(err, docs) {
        if (err) {
            console.log(err);
            res.status(500);
            res.json({error:"Internal server error looking up the ripped stats."});
        } else {          
            if(docs[0]) {
                res.status(200);
                res.json(docs[0]);
            }
            else {
                res.status(500);
                res.json({error:"Internal server error looking up the ripped stats."});
            }
        }
    });
});

app.get('/new_ripped', checkAuth, function (req, res) {

    var user = req.signedCookies.user_id;

    var db_query = '';

    if(req.signedCookies.admin == 'true') {
        db_query = 'CALL get_new_ripped_data();';
    }
    else {
        db_query = 'CALL get_new_ripped_data_by_user( \'' + user +'\');';
    }

    db.query(db_query, function(err, docs) {
        if (err) {
            console.log(err);
            res.status(500);
            res.json({error:"Internal server error looking up the new ripped stats."});
        } else {          
            if(docs[0]) {
                res.status(200);
                res.json(docs[0]);
            }
            else {
                res.status(500);
                res.json({error:"Internal server error looking up the new ripped stats."});
            }
        }
    });
});

app.get('/lander_info', checkAuth, function (req, res) {

    var user = req.signedCookies.user_id;
    var db_query = '';

    if(req.signedCookies.admin == 'true') {
        db_query = 'SELECT * FROM lander_info ORDER BY url;';
    }
    else {
        db_query = 'SELECT * FROM lander_info WHERE user = \'' + user +'\' ORDER BY url;';
    }

    db.query(db_query, function(err, docs) {
        if (err) {
            console.log(err);
            res.status(500);
            res.json({error:"Internal server error looking up the registered lander stats."});
        } else {          
            res.status(200);
            res.json({rows:docs});
        }
    });
});

app.get('/stats_overview', checkAuth, function (req, res) {
    
    var user = req.signedCookies.user_id;
    var db_query = '';

    if(req.signedCookies.admin == 'true') {
        db_query = 'CALL get_stats_overview();';
    }
    else {
        db_query = 'CALL get_stats_overview_by_user(\''+user+'\');';
    }

    db.query(db_query, function(err, docs) {
        if (err) {
            console.log(err);
            res.status(500);
            res.json({error:"Internal server error looking up the stat overview."});
        } else {          
            if(docs[0][0]) {
                res.status(200);
                res.json(docs[0][0]);
            }
            else {
                res.status(500);
                res.json({error:"Internal server error looking up the stat overview."});
            }
        }
    });
});

app.put("/update_ripped_url/:id", checkAuth, function(req, res) {
    var id = req.body.id;
    var user = req.signedCookies.user_id;
    var replacement_links = req.body.replacement_links;
    var redirect_rate = req.body.redirect_rate;

    if(req.signedCookies.admin == 'true') {
        user = 'admin';
    }

    if(!replacement_links) {
        var err = "No replacement link given.";
        console.log(err);
        res.status(400);
        res.json({error:err});
        return;
    }

    if(!redirect_rate) {
        var err = "No redirect rate given.";
        console.log(err);
        res.status(400);
        res.json({error:err});
        return;
    }

    db.query('CALL update_ripped_url(?,?,?,?);', [id, user, replacement_links, redirect_rate], function(err, docs) {
        if(err) {
            console.log(err);
            res.status(500);
            res.json({error:"Error updating ripped url info."});
        }
    });

    res.status(200);
    res.json({success:"Success"});
});

app.put("/update_ripped_url_by_offer_id/:ripped_id", checkAuth, function(req, res) {
    var ripped_id = req.param("ripped_id");
    var user = req.signedCookies.user_id;
    var offer_id = req.body.offer_id;

    if(req.signedCookies.admin == 'true') {
        user = 'admin';
    }

    if(!offer_id) {
        var err = "No offer id given.";
        console.log(err);
        res.status(400);
        res.json({error:err});
        return;
    }

    if(!ripped_id) {
        var err = "No ripped url id given.";
        console.log(err);
        res.status(400);
        res.json({error:err});
        return;
    }

    db.query('CALL update_ripped_url_by_offer_id(?,?,?);', [offer_id, ripped_id, user], function(err, docs) {
        if(err) {
            console.log(err);
            res.status(500);
            res.json({error:"Error updating ripped url info."});
        }
    });

    res.status(200);
    res.json({success:"Success"});
});

app.get('/offers', checkAuth, function (req, res) {
    
    var user = req.signedCookies.user_id;
    var db_query = '';

    if(req.signedCookies.admin == 'true') {
        db_query = 'SELECT * FROM offers;';
    }
    else {
        db_query = 'SELECT * FROM offers WHERE USER = \''+user+'\';';
    }

    db.query(db_query, function(err, docs) {
        if (err) {
            console.log(err);
            res.status(500);
            res.json({error:"Internal server error looking up the offers list."});
        } else {          
            if(docs) {
                res.status(200);
                res.json(docs);
            }
            else {
                res.status(500);
                res.json({error:"Internal server error looking up the offers list."});
            }
        }
    });
});

app.post("/update_offer", checkAuth, function(req, res) {
    var user = req.signedCookies.user_id;
    var offer_link = req.body.offer_link;
    var name = req.body.name;
    var website = req.body.website;
    var login = req.body.login;

    if(!offer_link) {
        var err = "No offer link given.";
        console.log(err);
        res.status(400);
        res.json({error:err});
        return;
    }

    if(!name) {
        var err = "No offer name given.";
        console.log(err);
        res.status(400);
        res.json({error:err});
        return;
    }

    if(!website) {
        website = '';
    }

    if(!login) {
        login = '';
    }

    db.query('INSERT INTO offers (name, offer_link, user, website, login) VALUES (?,?,?,?,?);', [name, offer_link, user, website, login], function(err, docs) {
        if(err) {
            console.log(err);
            res.status(500);
            res.json({error:"Error adding new offer."});
        }
    });

    res.status(200);
    res.json({success:"Success"});
});

app.delete("/update_offer/:id", checkAuth, function(req, res) {
    var id = req.param("id");
    var user = req.signedCookies.user_id;

    if(req.signedCookies.admin == 'true') {
        user = 'admin';
    }

    db.query('CALL delete_offer(?,?);', [id, user], function(err, docs) {
        if(err) {
            console.log(err);
            res.status(500);
            res.json({error:"Error deleting offer with id " + id});
        }
    });

    res.status(200);
    res.json({success:"Success"});
});

app.put("/update_offer/:offer_id", checkAuth, function(req, res) {
    var user = req.signedCookies.user_id;
    var offer_id = req.param("offer_id");
    var offer_link = req.body.offer_link;
    var name = req.body.name;
    var website = req.body.website;
    var login = req.body.login;

    if(req.signedCookies.admin == 'true') {
        user = 'admin';
    }

    if(!offer_id) {
        var err = "No offer id given.";
        console.log(err);
        res.status(400);
        res.json({error:err});
        return;
    }

    if(!offer_link) {
        var err = "No offer link given.";
        console.log(err);
        res.status(400);
        res.json({error:err});
        return;
    }

    if(!name) {
        var err = "No offer name given.";
        console.log(err);
        res.status(400);
        res.json({error:err});
        return;
    }

    if(!website) {
        website = '';
    }

    if(!login) {
        login = '';
    }

    db.query('CALL update_offer(?,?,?,?,?,?);', [offer_id, user, offer_link, name, website, login], function(err, docs) {
        if(err) {
            console.log(err);
            res.status(500);
            res.json({error:"Error updating offer with id " + id});
        }
    });

    res.status(200);
    res.json({success:"Success"});
});

function createStagingPath(unique_zip_name, callback){
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

function getLanderId(user, callback) {
    var error;
    var lander_id;

    var lander_uuid = uuid.v1();

    connection.query("CALL get_lander_id(?, ?);", [user, lander_uuid], function(err, docs) {
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

function unzip(zip_path, index_name, zip_name, callback) {
    var error;
    var index_path_and_name;

    var unzip_cmd = 'unzip -o ' + zip_path + "/" + zip_name + ' -d ' + zip_path;
    var find_cmd = 'find ' + zip_path + ' -name \"' + index_name +'\"';
    cmd.exec(unzip_cmd, function (err, stdout, stderr) {
        if(!err) {
            cmd.exec(find_cmd, function (err, stdout, stderr) {
                var lines = stdout.split('\n');
                if(lines.length == 1) {
                    index_path_and_name = lines[0];
                    callback(index_path_and_name, error)
                }
                else if (lines.length > 1){
                    index_path_and_name = lines[0];
                    console.log("Warning: more than one index file with name=" + index_name + ". Using first one...");
                    callback(index_path_and_name, error)
                }
                else {
                    error = "Index file not found."
                    callback('', error)
                }
            });
        }
        else {
            error = "Error unziping file";
            cleanUpStaging(zip_path);
            callback('', error);
        }
    });
}

function extractData(index_path_and_name, lander_uuid, callback) {
    var error;

    console.log('Extracting links from: ' + index_path_and_name);

    fs.readFile(index_path_and_name, function(err, html) {
        if(err) {
            error = 'Error reading index file.';
            callback(error);
        }
        else {
            var $ = cheerio.load(html);

            var links_str = "";
            $('a').each(function(i, elem) {
                links_str = links_str + elem.attribs.href + ",";
            });

            links_str = links_str.substring(0, links_str.length - 1); //remove trailing comma

            connection.query("UPDATE lander_info SET links_list = ? WHERE (uuid = ?);", [links_str, lander_uuid], function(err2, docs) {
                if(err2) {
                    error = "Could not update links list for lander uuid = " + lander_uuid;
                }
                callback(error);
            });
        }
    });  
}

function installLanderCode(staging_path, lander_uuid, callback) {
    var error;
    var find_cmd = 'find ' + staging_path + ' -name "*.js"';

    console.log("Installing clickjacker...");

    cmd.exec(find_cmd, function (err, stdout, stderr) {
        var js_files = stdout.split('\n');
        callback(error);
    });

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
            connection.query("UPDATE lander_info SET archive_path = ? WHERE (uuid = ?);", [archive_path + zip_name, lander_uuid], function(err2, docs) {
                if(err2) {
                    error = "Could save archive path for lander uuid = " + lander_uuid;
                }
                callback(archive_path + zip_name, error);
            });
        });
    });
}

function cleanUpStaging(staging_path, callback){
    var error;
    console.log("Cleaning up staging path: " + staging_path);

    cmd.exec("rm -rf " + staging_path, function (err, stdout, stderr) {
        if(err) {
            error = "Could not clean up staging directory: " + staging_path;
        }
        callback(error);
    });
}

app.post('/upload', checkAuth, function(req, res) {
 
    var user = req.session.user_id;
    var index_name = req.body.indexName;
    var staging_path;                
    var zip_name=req.files.myFile.originalname; 
    var zip_path;
    var lander_id;
    var lander_uuid;
    var index_path;
    var index_path_and_name;

    createStagingPath(req.files.myFile.name, function(staging_path, error) {
        if(error) {
            console.log(error);
            res.status(500);
            res.send(error);
            return;
        }
        else {
            zip_path=staging_path;
        }

        stageFile(req.files.myFile.path, staging_path, zip_name, function(error) {
            if(error) {
                console.log(error);
                res.status(500);
                res.send(error);
                return;
            }

            unzip(staging_path, index_name, zip_name, function(index_file_and_path, error) {
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

                    extractData(index_file_and_path, lander_uuid, function(error) {
                        if(error) {
                            console.log(error);
                            res.status(500);
                            res.send(error);
                            return;
                        }

                        installLanderCode(staging_path, lander_uuid, function(error) {
                            if(error) {
                                console.log(error);
                                res.status(500);
                                res.send(error);
                                return;
                            }

                            rezipAndArchive(staging_path, zip_name, lander_uuid, user, function(archive_path, error) {
                                if(error) {
                                    console.log(error);
                                    res.status(500);
                                    res.send(error);
                                    return;
                                }
                                else {
                                    cleanUpStaging(staging_path, function(error) {
                                        if(error) {
                                            console.log("Warning: " + error);
                                        }
                                        res.status(200);

                                        var response = {
                                          download: archive_path
                                        };

                                        res.send(response);
                                    });
                                }
                            }); //rezipAndArchive
                        }); //installLanderCode
                    }); //extractData
                }); //getLanderId
            }); //unzip 
        }); //stageFile
   
    }); //createStagingPath


});

module.exports = app;