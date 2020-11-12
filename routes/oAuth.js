const express = require('express');
const router = express.Router();

const {
  googleLogIn,
  googleCallback,
} = require('../controllers/google-auth');


const {
  facebookLogIn,
  facebookCallback,
} = require('../controllers/facebook-auth');

const logOut = (req, res) => {
  req.session = null;
  req.logout();
  res.status(200).json({msg: `You just logged out!`})
}

const isLoggedIn = (req, res, next) => {
  if(!req.user) {
    res.status(401).json({msg: `You're not logged in!`})
    return;
  }
  next();
}

const success = (req, res) => res.status(200).json({ msg: `Welcome ${req.user.profileName}!`});
const failed = (req, res) => res.status(401).json({ msg: 'Login failed'});

router.route('/success').get(isLoggedIn, success);
router.route('/failed').get(failed);
router.route('/logout').get(logOut)
router.route('/google').get(googleLogIn);
router.route('/google/callback').get(googleCallback);
router.route('/facebook').get(facebookLogIn);
router.route('/facebook/callback').get(facebookCallback);
router.route('/logout').get(logOut);

module.exports = router;