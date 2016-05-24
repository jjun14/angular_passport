// var login = require('./login.js');
// var signup = require('./signup.js');
var facebook = require('./facebook.js');
var mongoose = require('mongoose');
var User = mongoose.model('User');
module.exports = function(passport){
  passport.serializeUser(function(user,done){
    console.log('serializing user: ');
    console.log(user);
    done(null, user._id);
  });

  passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
      console.log('deserializing user:', user);
      done(err, user)
    })
  });

  // set up passport strategies here
  // signup(passport);
  // login(passport);
  facebook(passport);
}
