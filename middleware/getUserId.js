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
      req.userId = decoded._id;
      next();
    } catch (error) {
      req.userId = null;
      next();
    }
  }
}

module.exports = getUserId;
