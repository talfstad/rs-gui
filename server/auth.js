module.exports = function(app, db, checkAuth){

    var _ = require("underscore");
    var config = require("./config");
    var utils = require("./utils");
    var bcrypt = require("bcrypt-nodejs");
    var randomstring = require("randomstring");

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
                        res.cookie('icon_img', row.icon_img, { signed: true, maxAge: config.cookieMaxAge  });
                        res.cookie('username', row.username, { signed: true, maxAge: config.cookieMaxAge  });

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
        res.clearCookie('username');
        res.clearCookie('img_icon');
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

}