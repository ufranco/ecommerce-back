const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const asyncHandler = require('../middleware/asyncHandler');
const User = require('../models/User');

exports.logIn = asyncHandler(async (req, res) => {

  const  { 
    identifier,
    password 
  } = req.body;

  const userLog = await User.findOne({ 
    $or: [
      { username:  identifier },
      { email: identifier }
    ] 
  });

  if(!userLog) {
    return res.status(400).json({ msg : 'Provided user does not exist.' });
  }

  const isMatch = await bcrypt.compare(password, userLog.password);

  if(!isMatch) {
    return res.status(401).json({ msg : 'Wrong password.' });
  }

  const user = {
    id: userLog.id
  };

  const { signError, token } = await jwt.sign(
    { user }, 
    process.env.AUTH_SECRET, 
    { expiresIn: 3600 }
  );

  if(signError){
    res.status(500).json({ msg: 'Server error' });
  }

  res.status(200).json({ token });

});

exports.register = asyncHandler(async (req, res) => {

  const {
    username,
    password,
    email,
    profileName,
    country,
    profilePic,
  } = req.body;

  const salt = await bcrypt.genSalt(10);

  const user = new User({
    username,
    password : await bcrypt.hash(password, salt),
    email,
    profileName,
    country,
    profilePic
  });

  await user.save();

  const payload = {
    user : {
      id: user.id
  }};
  
  jwt.sign(
    payload,
    process.env.AUTH_SECRET,
    { expiresIn: 3600 },
    (err, token) => {
      if(err) throw err;
      res.status(201).json({ token });
    }
  );

});


