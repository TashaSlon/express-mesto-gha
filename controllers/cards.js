const Card = require('../models/card');
const NotCorrectError = require('../errors/not-auth-err');
const NotAllowError = require('../errors/not-allow-err');
const NotFoundError = require('../errors/not-found-err');

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create(
    {
      name, link, owner: req.user._id, likes: [],
    },
  )
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      next(err);
    });
};

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((card) => res.send(card))
    .catch((err) => {
      next(err);
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(() => new Error('Not found'))
    .then((card) => {
      if (card.owner === req.user._id) {
        Card.findByIdAndRemove(req.params.cardId)
          .then((item) => res.send(item))
          .catch(() => {
            throw new NotCorrectError('Переданы некорректные данные');
          });
      } else {
        throw new NotAllowError('Невозможно удалить чужую карточку');
      }
    })
    .catch((err) => {
      if (err.message === 'Not found') {
        throw new NotFoundError('Карточка с указанным _id не найдена');
      } else {
        next(err);
      }
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => new Error('Not found'))
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => new Error('Not found'))
    .then((card) => res.send(card))
    .catch((err) => {
      next(err);
    });
};
