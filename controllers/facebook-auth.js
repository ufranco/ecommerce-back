const asyncHandler = require('../middleware/asyncHandler');
const passport = require('passport');

exports.facebookLogIn = passport.authenticate('facebook', { scope : 'email' });

exports.facebookCallback = passport.authenticate('facebook', { 
    successRedirect: '/api/oauth/success',
    failureRedirect: '/api/oauth/failed'
});