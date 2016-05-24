var jwt = require('jsonwebtoken');
var config = require('../config/config');
var jwtSecret = config.jwtSecret;
var bcrypt = require('bcrypt-nodejs');
var xssFilters = require('xss-filters')
var mongoose = require('mongoose');
var User = mongoose.model('User');

// using bcrypt to create a password hash
var createHash = function(password){
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
}

// using bcrypt to check passwords at login
var isValidPassword = function(user, password){
    return bcrypt.compareSync(password, user.password);
}

function validateRegistration(req, res, next){
  var body = req.body;
  if (!body.email || !body.password || !body.first_name || !body.last_name) {
     res.status(400).json({'err': 'Must provide username and password'});
  }
  next();
}

function validateLogin(req, res, next){
  var body = req.body;
  if (!body.email || !body.password) {
     res.status(400).json({'err': 'Must provide username and password'});
  }
  next();
}

module.exports = function(app, passport){
  // to validate our post data on certain requests
  app.get('/partials/*', function(req, res){
    console.log(req);
    // res.sendFile()
  })

  // routes go here
  // route for local registration
  app.post('/register', validateRegistration, function(req, res){
    console.log('registering');
    var body = req.body;
    console.log(body);
    var filteredFirstName = xssFilters.inHTMLData(body.first_name);
    var filteredLastName = xssFilters.inHTMLData(body.last_name);
    var filteredEmail = xssFilters.inHTMLData(body.email);
    var filteredPassword = xssFilters.inHTMLData(body.password);
    var new_user = new User({first_name: filteredFirstName, last_name: filteredLastName, email: filteredEmail, password: createHash(filteredPassword)});
    new_user.save()
      .then(function success(user){
        console.log('user saved properly');
        var token = jwt.sign(
            {
              _id: user._id,
              email: user.email
            },
            jwtSecret,
            {expiresIn: 86400} 
        );
        res.json({
          token: token,
          user: {_id: user._id, email: user.email, logged_in: true}
        });
      }, function error(err){
        console.log('error on the server', err);
        res.status(500).json({status: "Internal Server Error"});
      })
  });

  // route for local login
  app.post('/login', validateLogin, function(req, res){
    var body = req.body;
    console.log(body);
    var filteredEmail = xssFilters.inHTMLData(body.email);
    User.findOne({email: filteredEmail}).exec()
      .then(function success(user){
        if(body.email !== user.email || !isValidPassword(user, body.password)){
          res.status(401).end("Invalid login credentials");
          return;
        }
        var token = jwt.sign({
          _id: user._id,
          email: user.email
        }, jwtSecret);
        res.send({
          token: token,
          user: {_id: user._id, email: user.email, logged_in: true}
        });
      })
      .then(null, function error(err){
        console.log(err);
        res.status(500).end("Internal Server Error");
      })
  });

  // routes for facebook authentication and login

  // for fb login
  app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));


  // redirect uri upon successful fb authentication;
  app.get('/auth/facebook/callback/', function(req, res, next){
    passport.authenticate('facebook', function(err, user, info){
      if(err) { console.log('ERRRORRRR')}
      if(!user){ return res.redirect('/#/'); }
      console.log('in the routes');
      var token = jwt.sign({
          _id: user._id,
          email: user.email },
          jwtSecret);

      // set a cookie on the client side with the jwt
      res.cookie('auth-token', token);

      res.redirect('/#/users');
    })(req, res, next);
  });
  // test route to get data once the user has been authenticated
  app.get('/authenticated', function(req, res){
    var user = req.user;
    user.logged_in = true;
    console.log(user);
    res.send(user);
  })


}