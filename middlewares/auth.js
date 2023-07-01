const jwt = require('jsonwebtoken');
const NotAuthError = require('../errors/not-auth-err');

const extractBearerToken = (header) => header.replace('Bearer ', '');

module.exports = (req, res, next) => {
  const { authorization } = req.cookies.jwt;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new NotAuthError('Необходима авторизация');
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, 'super-strong-secret');
  } catch (e) {
    next(e);
  }

  req.user = payload;
  next();
  return res;
};
