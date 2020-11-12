const jwt = require('jsonwebtoken');
const passport = require('passport');

exports.userAuth = (req, res, next) => {
  const token = req.header('x-auth-token');

  if(!token) {
    return res.status(401).json({ msg: 'No token, authorizaton denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();

  } catch(err) {
    res.status(401).json({ msg: 'Token not valid' })
  }
};