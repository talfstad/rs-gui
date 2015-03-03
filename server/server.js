
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

// app.use(app.router);

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
      console.log(req.body.username);
        if(rows.length == 1) {
            var row = rows[0];
            
            // Compare the POSTed password with the encrypted db password
            if(bcrypt.compareSync( req.body.password, row.hash)) {
                
                if(!row.approved) {
                    res.json({error: "Your account isn't activated yet."});
                } else {
                    res.cookie('user_id', row.user, { signed: true, maxAge: config.cookieMaxAge  });
                    res.cookie('auth_token', row.auth_token, { signed: true, maxAge: config.cookieMaxAge  });

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

    db.query('SELECT daily_stats.*,get_country_distribution(url) AS country_dist FROM daily_stats WHERE user = ? ORDER BY url;', [user], function(err, docs) {
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

    url = req.query.url;
    var user = req.signedCookies.user_id;

    db.query('SELECT * FROM hourly_stats WHERE user = ? AND url = ?;', [user, url], function(err, docs) {
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

    db.query('SELECT ripped.*,get_country_distribution(url) AS country_dist FROM ripped WHERE user = ? ORDER BY url;', [user], function(err, docs) {
        if (err) {
            console.log(err);
            res.status(500);
            res.json({error:"Internal server error looking up the ripped stats."});
        } else {          
            res.status(200);
            res.json({rows:docs});
        }
    });
});

app.get('/lander_info', checkAuth, function (req, res) {

    var user = req.signedCookies.user_id;

    db.query('SELECT * FROM lander_info WHERE user = ? ORDER BY url;', [user], function(err, docs) {
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

    db.query('CALL get_stats_overview();', function(err, docs) {
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

app.post("/update_ripped_url", checkAuth, function(req, res) {
    
    var url = req.body.url;
    var uuid = req.body.uuid;
    var user = req.signedCookies.user_id;
    var replacement_links = req.body.replacement_links;
    var redirect_rate = req.body.redirect_rate;

    if(!replacement_links) {
        console.log(err);
        res.status(400);
        res.end("No replacement link given.");
        return;
    }

    if(!redirect_rate) {
        console.log(err);
        res.status(400);
        res.end("No redirect rate given.");
        return;
    }

    db.query('CALL update_ripped_url(?,?,?,?,?);', [url, uuid, user, replacement_links, redirect_rate], function(err, docs) {
        if(err) {
            console.log(err);
            res.status(500);
            res.end({error:"Error updating ripped url info."});
        }
    });

    res.status(200);
    res.json({success:"Successfully updated ripped url info."});
});

module.exports = app;