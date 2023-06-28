const Card = require('../models/card');

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create(
    {
      name, link, owner: req.user._id, likes: [],
    },
  )
    .then((card) => res.status(201).send(card))
    .catch(() => {
      res.status(400).send({ message: 'Переданы некорректные данные при создании карточки' });
    });
};

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((card) => res.send(card))
    .catch(() => {
      res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.find(req.params.cardId)
    .orFail(() => new Error('Not found'))
    .then((card) => {
      if (card.owner === req.user._id) {
        Card.findByIdAndRemove(req.params.cardId)
          .then((item) => res.send(item))
          .catch(() => {
            res.status(400).send({ message: 'Переданы некорректные данные' });
          });
      } else {
        res.status(403).send({ message: 'Невозможно удалить чужую карточку' });
      }
    })
    .catch((err) => {
      if (err.message === 'Not found') {
        res
          .status(404)
          .send({
            message: 'Карточка с указанным _id не найдена',
          });
      } else {
        res.status(400).send({ message: 'Переданы некорректные данные' });
      }
    });
};

module.exports.likeCard = (req, res) => {
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
      if (err.message === 'Not found') {
        res
          .status(404)
          .send({
            message: 'Карточка с указанным _id не найдена',
          });
      } else {
        res.status(400).send({ message: 'Переданы некорректные данные для постановки лайка' });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => new Error('Not found'))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.message === 'Not found') {
        res
          .status(404)
          .send({
            message: 'Карточка с указанным _id не найдена',
          });
      } else {
        res.status(400).send({ message: 'Переданы некорректные данные для снятия лайка' });
      }
    });
};
