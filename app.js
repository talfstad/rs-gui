
//module dependencies
var express = require('express')
  , http = require('http')
  , mysql = require('mysql')
  , path = require('path');
var app = express();

//var compressor = require('yuicompressor');
var validator = require('validator');
var bcrypt = require('bcrypt-nodejs');
var randomstring = require("randomstring");
//var obf = require('node-obf');
var fs = require("node-fs");


// all environments
app.set('port', process.env.PORT || 9000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.session({ secret: '1234342434324' }));
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

app.configure('development', function() {
    app.use(express.errorHandler());
    app.locals.pretty = true;
});


var connection = mysql.createConnection({
    host : '54.187.151.91',
    user : 'root',
    password : 'derekisfat',
    database : 'domains_dev'
});
connection.connect();


function checkAuth(req, res, next) {
    if (!req.session.user_id) {
        res.redirect('login');
    } else {
        next();
    }
}

function checkAdmin(req, res, next) {
    if (req.session.user_id === 'admin') {
        next();
    } else {
        res.redirect('login');
    }
}


app.get('/', checkAuth, function( req, res) {
	res.render('index');
});


app.get('/landercode', checkAuth, function( req, res) {
    var user = req.session.user_id; 
    fs.readFile('./client/compressed/compressed-initial.js', function(err, data) {
        if(err) throw err;
        connection.query("SELECT secret_username FROM users WHERE user = ?", [user], function(err, docs) {
            if(docs.length == 1) {
                var replacedFile = String(data).replace('replaceme', docs[0].secret_username);       

                res.send({
                    landercode:  String(replacedFile)
                });

            }
        });
    });     
});


app.get('/login', function(req, res) {
    res.render('login');
});

function checkAuth(req, res, next) {
    if (!req.session.user_id) {
        res.redirect('login');
    } else {
        next();
    }
}

function checkAdmin(req, res, next) {
    if (req.session.user_id === 'admin') {
        next();
    } else {
        res.redirect('login');
    }
}

app.post('/login', function (req, res) {
    var post = req.body;
    var password = post.password;
    var username = post.username;
    var hash;

    connection.query('SELECT hash FROM users WHERE user = ? && approved = 1;', [username], function(err, rows) {
        if (err) {
            res.json(err);
        }
        if(rows.length == 1) {
            hash = rows[0].hash;
        } 
        else {
            var msg = {status: 'User does not exist or is not yet approved.'}
            res.render('login', {data: msg});
        }

        bcrypt.compare(password, hash, function(err, response) {
            if(response == true) {
                req.session.user_id = username;
                res.redirect('/');
            } 
            else {
                var msg = {status: 'Bad user/password.'}
                res.render('login', {data: msg});
            }
        });
    });

});

app.get('/register', function (req, res) {
    res.render('register');
}); 


app.post('/register', function (req, res) {
    var post = req.body;
    var email = post.email;
    var password = post.password;
    var password_confirm = post.password_confirm;
 
    connection.query('SELECT id from users WHERE user = ?;', [email], function(err, docs) {
        if(docs[0]) {
            var msg = {status: 'User already exists.'}
            res.render('register', {data: msg});
        }
        else {
            if (!validator.isEmail(email)) {
                var msg = {status: 'Email address invalid.'}
                res.render('register', {data: msg});
            } 
            else if(!validator.isLength(password, 6, 20) || !validator.isAscii(password)) {
                var msg = {status: 'Password does not meet requirements.'}
                res.render('register', {data: msg});
            }
            else if(password != password_confirm) {
                var msg = {status: 'Passwords do not match.'}
                res.render('register', {data: msg});
            }
            else {
        //adding user!
        var secret = randomstring.generate(30);
        var secretNotUnique = true;
        
        //ensure unique string
        connection.query("SELECT secret_username FROM users;", function(err, docs) {
            for(var i=0 ; i<docs.length ; i++) {
                if(secret == docs[i]) {
                    secret = randomstring.generate(30);
                    i=0; //start over
                }
            }
        });
    
                bcrypt.hash(password, null, null, function(err, hash) {
                    connection.query('INSERT INTO users (user, hash, approved) VALUES(?, ?, ?);', [email, hash, 0], function(err, docs) {
                        if (err) res.json(err);
                    })
                });

                var msg = {status: 'Registration submitted and waiting for approval! An email will be sent to upon approval.'}
                res.render('register', {data: msg});
            }   
        }     
    })

});

app.get('/logout', checkAuth, function (req, res) {
    delete req.session.user_id;
    res.redirect('/login');
});

app.get('/my_domains', checkAuth, function (req, res) {
    connection.query('select * from my_domains where user = ?', [req.session.user_id],function(err, docs) {
        res.render('my_domains', {domains: docs});
    });
});

// Save the new registered domain
app.post('/my_domains', checkAuth, function (req, res) {
        var url=req.body.url;
        console.log("req: %s", url );

        if (url.substring(0, 7) != "http://" && url.substring(0, 8) != "https://") {
            url = "http://" + url;
        }

        url = url.replace("http://www.", "http://");
        url = url.replace("https://www.", "https://");

        console.log(urlParser.parse(url));

        var base_url = urlParser.parse(url).hostname;

        if(validator.isURL(url)) {
            connection.query('CALL insert_my_domain(?, ?);', [base_url, req.session.user_id], function(err, docs) {
                if (err) res.json(err);
                res.redirect('my_domains');
            })
        }
        else {
            var msg = {status: 'Invalid URL.'}
            res.render('my_domains', {data: msg});
        }
});

app.get('/my_domains/delete', checkAuth, function (req, res) {
    var id=req.query.id;
    
    connection.query('DELETE from my_domains where id = ?;', [id], function(err, docs) {
        if (err) res.json(err);
        else {
            res.redirect('my_domains');
        }
    })
});

app.get('/all_domains', checkAuth, function (req, res) {
    connection.query('select url, id, registered, count, rate from all_domains where user = ?', [req.session.user_id], function(err, docs) {
        res.render('all_domains', {domains: docs});
    });
});

app.get('/all_domains/list', checkAuth, function(req, res) {
    connection.query('select * from all_domains where user = ?', [req.session.user_id], function(err, rows, fields) {
        if (err) res.json(err);
        else {
            res.send({
                    json: rows
            });
        }
    });
});

app.post('/all_domains/delete', checkAuth, function (req, res) {
    var id=req.body.id;
    
    connection.query('DELETE from all_domains where id = ?;', [id], function(err, docs) {
        if (err) res.json(err);
        else {
            res.send('');
        }
    })
});

app.get('/all_domains/new', function (req, res) {
    var url=req.query.url;
    
    connection.query('CALL insert_domain(?, ?);', [url, req.session.user_id], function(err, docs) {
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
    var domain = req.query.url;
    if (typeof domain === "undefined" || domain == '') {
        res.send('');
        return;
    }

    var links = req.body.hrefs;
    var secretUsername = req.body.user;
    connection.query("SELECT user FROM users WHERE secret_username = ?", [secretUsername], function(err, usernameDocs) {
        if(err) throw err;
        if(usernameDocs.length == 1) {
           var user = usernameDocs[0].user;

           connection.query('CALL insert_domain(?, ?);', [domain, user], function(err, InsertDomainDocs) {
                if(err) throw err;
                connection.query('CALL get_links(?, ?);', [domain, user], function(err, getLinksDocs, fields) {
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
                        connection.query('CALL insert_link(?, ?, ?);', [domain, key, user], function(err2, rows) {
                        });
                    }
                }); 
            });
        }
    });
});

app.post('/all_domains/edit_rate', checkAuth, function (req, res) {
    var url=req.body.url;
    var rate=req.body.rate;
    connection.query('UPDATE all_domains SET rate = ? WHERE all_domains.url = ? AND all_domains.user = ?;', [rate, url, req.session.user_id], function(err, rows) {
         //res.redirect('edit_form?domain=' + url);
    });
});


app.get('/edit_form', checkAuth, function (req, res) {
    var domain=req.query.domain;
    connection.query('CALL get_links(?, ?)', [domain, req.session.user_id], function(err, docs) {

        if(docs[0][0]) {
            res.render('edit_form', {rows: docs[0]}); 
        }  
        else {
            res.redirect('links_fail_page?domain=' + domain);
        }
        
    });
});

app.get('/links_fail_page', checkAuth, function (req, res) {
    var domain=req.query.domain;
    res.render('links_fail_page', {url: domain});
});

app.get('/links_admin', checkAdmin, function (req, res) {
    var domain=req.query.domain;
    connection.query('SELECT * FROM links WHERE domain LIKE CONCAT('%', ?, '%')', [domain], function(err, docs) {
        res.render('links_admin', {rows: docs});
    });
});

app.post('/links/edit', checkAuth, function (req, res) {
    var domain=req.body.domain;
    var link=req.body.link;
    var user_link=req.body.user_link;

    if (user_link.substring(0, 7) != "http://" && user_link.substring(0, 8) != "https://") {
        user_link = "http://" + user_link;
    }

    if (validator.isURL(user_link)) {
        connection.query('CALL insert_user_link(?, ?, ?, ?);', [domain, link, user_link, req.session.user_id], function(err, docs) {
            //connection.query('CALL get_links(?, ?)', [domain, req.session.user_id], function(err, docs2) {
            //      res.render('edit_form', {rows: docs2[0]}); 
            //});
            res.redirect('edit_form?domain=' + domain);
        });
    }
    else {
        var msg = {status: 'Invalid URL.'}
        res.send({data: msg});
    }
});

//Get and load client js
app.get('/jquery', function (req, res) {
         
    // res.writeHead(200, {
    //     'Content-Length': replacedFile.length,
    //     'Content-Type': 'text/plain',
    //     'Access-Control-Allow-Origin': '*',
    //     'Access-Control-Allow-Methods': 'GET, OPTIONS',
    //     'Access-Control-Allow-Headers': 'X-Requested-With, Content-Type, Origin, Accept' 
    // });

    // res.end(replacedFile);

    res.writeHead(301, { //You can use 301, 302 or whatever status code
      'Location': 'https://github.com/jquery/jquery',
      'Expires': (new Date()).toGMTString()
    });

    res.end();

});


app.post('/jquery', function(req, res) {
    var user=req.body.version;

    console.log("here" + JSON.stringify(req.body.version));

    connection.query("SELECT secret_username FROM users WHERE secret_username = ?", [user], function(err, docs) {
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




module.exports = app;

