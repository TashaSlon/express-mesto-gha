const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const process = require('process');
const { celebrate, Joi, errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const {
  createUser, login,
} = require('./controllers/users');
const routerUsers = require('./routes/users');
const routerCards = require('./routes/cards');
const auth = require('./middlewares/auth');
const NotFoundError = require('./errors/not-found-err');
const NotAuthError = require('./errors/not-auth-err');
const AbstractError = require('./errors/abstract-err');
const NotCorrectError = require('./errors/not-correct-err');
const ExistError = require('./errors/exist-err');
const NotAllowError = require('./errors/not-allow-err');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
});
app.use(express.json());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().regex(/^[a-z0-9._%+-]+@[a-z0-9-]+.+.[a-z]{2,4}$/i),
    password: Joi.string().required().min(8),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().regex(/^[a-z0-9._%+-]+@[a-z0-9-]+.+.[a-z]{2,4}$/i),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(/^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/),
  }),
}), createUser);

app.use(errors());
app.use(auth);
app.use('/users', routerUsers);
app.use('/cards', routerCards);
app.use('/*', (req, res, next) => {
  const err = {};
  err.name = 'Not found';
  next(err);
});

app.use((err, req, res, next) => {
  let error;

  if (err.name === 'NotAllow') {
    error = new NotAllowError('Невозможно удалить чужую карточку');
  } else
  if (err.code === 11000) {
    error = new ExistError('При регистрации указан email, который уже существует на сервере');
  } else
  if (err.name === 'ValidationError') {
    error = new NotCorrectError('Переданы некорректные данные');
  } else
  if (err.name === 'Not found') {
    error = new NotFoundError('Данные не найдены');
  } else
  if (err.name === 'JsonWebTokenError') {
    error = new NotAuthError('Необходима авторизация');
  } else {
    error = new AbstractError('На сервере произошла ошибка');
  }
  res.status(error.statusCode).send({ message: error.message });
  next();
});

app.listen(PORT);
