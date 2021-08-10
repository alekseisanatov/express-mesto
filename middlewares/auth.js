const jwt = require('jsonwebtoken');
const AccessingError = require('../errors/AccessingError');
const AuthError = require('../errors/AuthError');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new AuthError('Необходима авторизация');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, 'dev-secret');
  } catch (e) {
    throw new AccessingError('Необходима авторизация');
  }

  req.user = payload;
  return next();
};
