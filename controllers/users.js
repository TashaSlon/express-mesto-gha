const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const NotCorrectError = require('../errors/not-auth-err');
const ExistError = require('../errors/exist-err');
const NotFoundError = require('../errors/not-found-err');

module.exports.createUser = (req, res, next) => {
  const { name, about, avatar } = req.body;

  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      email: req.body.email,
      password: hash,
      name,
      about,
      avatar,
    }))
    .then((user) => res.status(201).send({
      email: user.email,
      name,
      about,
      avatar,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new NotCorrectError('Переданы некорректные данные при создании карточки');
      }
      if (err.code === 11000) {
        throw new ExistError('При регистрации указан email, который уже существует на сервере');
      }
      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      res.send({
        token: jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: '7d' }),
      });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => next(err));
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(() => new Error('Not found'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new NotCorrectError('Переданы некорректные данные при создании карточки');
      }
      if (err.message === 'Not found') {
        throw new NotFoundError('Карточка с указанным _id не найдена');
      }
      next(err);
    });
};

module.exports.getProfile = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => new Error('Not found'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new NotCorrectError('Переданы некорректные данные');
      }
      if (err.message === 'Not found') {
        throw new NotFoundError('Пользователь не найден');
      }
      next(err);
    });
};

module.exports.updateProfile = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    req.body,
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(() => new Error('Not found'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new NotCorrectError('Переданы некорректные данные при обновлении профиля');
      }
      if (err.message === 'Not found') {
        throw new NotFoundError('Такого пользователя не существует');
      }
      next(err);
    });
};

module.exports.updateAvatar = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    req.body,
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(() => new Error('Not found'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new NotCorrectError('Переданы некорректные данные при обновлении аватара');
      }
      if (err.message === 'Not found') {
        throw new NotFoundError('Такого пользователя не существует');
      }
      next(err);
    });
};
