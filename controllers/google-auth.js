const passport = require('passport');

exports.googleLogIn = passport.authenticate('google', { scope : ['profile', 'email'] });

exports.googleCallback = passport.authenticate('google', { 
    successRedirect: '/api/oauth/success',
    failureRedirect: '/api/oauth/failed'
  })