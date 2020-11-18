const express = require('express');
const { userAuth } = require('../middleware/authHandler');
const router = express.Router();

const {
  getCurrentUser,
  logIn,
  register,
} = require('../controllers/auth');

router.route('/').post(logIn);
router.route('/register').post(register);

module.exports = router;