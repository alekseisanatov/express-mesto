const jwt = require('jsonwebtoken');
const AccessingError = require('../errors/AccessingError');
const AuthError = require('../errors/AuthError');

const { JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const authorization = req.cookies.jwt;

  if (!authorization) {
    next(new AuthError('Необходима авторизация'));
  } else {
    let payload;
    try {
      payload = jwt.verify(authorization, JWT_SECRET);
    } catch (e) {
      next(new AccessingError('Необходима авторизация JWT'));
    }
    req.user = payload;
    next();
  }
};
