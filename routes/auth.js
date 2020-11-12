const express = require('express');
const { userAuth } = require('../middleware/authHandler');
const router = express.Router();

const {
  getCurrentUser,
  logIn,
} = require('../controllers/auth');

router.route("/").get(userAuth, getCurrentUser).post(logIn);

module.exports = router;