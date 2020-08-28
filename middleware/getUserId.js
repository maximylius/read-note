const config = require('config');
const jwt = require('jsonwebtoken');

function getUserId(req, res, next) {
  const token = req.header('x-auth-token');

  // check for token
  if (!token) {
    req.userId = null;
    next();
  } else {
    try {
      // verify token
      const decoded = jwt.verify(token, config.get('jwtSecret'));
      // add user
      req.userId = decoded;
      console.log('decoded userId', req.userId);
      next();
    } catch (error) {
      res.status(400).json({ msg: 'Token is not valid' });
    }
  }
}

module.exports = getUserId;
