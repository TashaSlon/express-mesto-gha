const jwt = require('jsonwebtoken');
const NotAuthError = require('../errors/not-auth-err');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, 'super-strong-secret');
  } catch (err) {
    next(new NotAuthError('Необходима авторизация'));
  }

  req.user = payload;
  next();
};
