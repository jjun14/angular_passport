var mongoose = require('mongoose');
var User = mongoose.model('User');
var config = require('../config.js');
var FacebookStrategy = require('passport-facebook').Strategy;

module.exports = function(passport){
  console.log(config.fb);
  passport.use('facebook', new FacebookStrategy({
    clientID: config.fb.appID,
    clientSecret: config.fb.appSecret,
    callbackURL: config.fb.callbackURL,
    profileFields: ['id', 'name', 'emails']
  },
    // facebook will send back the tokens and profile
    function(access_token, refresh_token, profile, done) {
      // asynchronous
      process.nextTick(function() {
        // find the user in the database based on their facebook id
        User.findOne({ 'fb.id' : profile.id }, function(err, user) {
          // if there is an error, stop everything and return that
          // ie an error connecting to the database
          console.log('user profile')
          console.log(profile);
          if (err)
            return done(err);
            // if the user is found, then log them in
            if (user) {
              console.log('found user!');
              return done(null, user); // user found, return that user
            } else {
              console.log('creating new user');
              // if there is no user found with that facebook id, create them
              var newUser = new User();
              // set all of the facebook information in our user model
              newUser.email = profile.emails[0].value;
              // set the users facebook id
              newUser.fb.id = profile.id;
              // we will save the token that facebook provides to the user
              newUser.fb.access_token = access_token;
              newUser.fb.first_name  = profile.name.givenName;
              // look at the passport user profile to see how names are returned
              newUser.fb.last_name = profile.name.familyName;
              // facebook can return multiple emails so we'll take the first
              newUser.fb.email = profile.emails[0].value;
              // save our user to the database
              newUser.save(function(err) {
                if (err)
                  throw err;
                // if successful, return the new user
                return done(null, newUser);
              });
          }
        });
      });
  }));
}
