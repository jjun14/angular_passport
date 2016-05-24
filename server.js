'use strict';

// Module dependencies
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var config = require('./server/config/config');
var express = require('express');
var expressSession = require('express-session');
var exressJwt = require('express-jwt');
var mongoose = require('mongoose');
var passport = require('passport');

// module variables
var port = process.env.PORT || 8000
var env = config.env
var dbURL = config.dbURL;
var sessionSecret = config.sessionSecret;
var jwtSecret = config.jwtSecret;

// app instance & config
var app = express();
app.set('port', port);
app.set('env', env);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'client')));
app.use(expressSession({
  secret:"a%fds1233ax!181f!asv2333r243",
  resave: true,
  saveUninitialized: true
}));
app.use(expressJwt({ secret: jwtSecret })
                .unless({ path: ['/','/login', '/register', '/favicon.ico', '/auth/facebook', '/auth/facebook/callback/', /\/partials\/\*.html/i] }));



// dbConnection
var dbConnect = require('./server/config/mongoConfig');
dbConnect(dbURL);

// Initialize Passport
var initPassport = require('./server/config/passport/init.js');
initPassport(passport);
app.use(passport.initialize());
app.use(passport.session());

// routes
require('./server/routes/routes.js')(app, passport);

app.listen(port, function(){
  return console.log('Listening on port ' + port + ' in ' + env + ' mode');
})
