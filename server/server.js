
//module dependencies
var express = require("express");
var http = require("http");
var mysql = require("mysql");
var path = require("path");
var app = express();

var config = require("./config");

//new middlewares
var logger = require('morgan');
var methodOverride = require('method-override');
var bodyParser = require('body-parser');
var multer = require('multer');
var errorHandler = require('errorhandler');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var csrf = require('csurf');

app.use(function logErrors(err, req, res, next) {
  console.error(err.stack);
  next(err);
});

app.use(methodOverride());
// app.use(logger('dev'));
app.use(bodyParser.json());   
app.use(bodyParser.urlencoded({ extended: true }));  // parse application/x-www-form-urlencoded
app.use(bodyParser.json());
app.use(multer());

// Cookie config
app.use( cookieParser( config.cookieSecret ) );           // populates req.signedCookies
app.use( cookieSession( config.sessionSecret ) );         // populates req.session, needed for CSRF
app.use(csrf({ cookie: true }));

// We need serverside view templating to initially set the CSRF token in the <head> metadata
// Otherwise, the html could just be served statically from the public directory
app.set('view engine', 'html');
app.set('views', __dirname + '/' );
app.engine('html', require('hbs').__express);

app.use(express.static(__dirname + '/../public'));

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

require('./auth')(app, db, checkAuth);
require('./offers')(app, db, checkAuth);
require('./ripped_stats')(app, db, checkAuth);
require('./registered_stats')(app, db, checkAuth);
require('./landers')(app, db, checkAuth);

app.get("*", function(req, res) {
    res.render('index', { csrfToken: req.csrfToken() });
});

module.exports = app;
