const Card = require('../models/card');

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
    .then((card) => {
      console.log(card);
      if (card.owner === req.user._id) {
        Card.findByIdAndRemove(req.params.cardId)
          .then((item) => res.send(item))
          .catch((err) => {
            console.log(err);
            next(err);
          });
      } else {
        const err = {};
        err.name = 'NotAllow';
        next(err);
      }
    })
    .catch((err) => {
      console.log('hhhhg7  gg');
      next(err);
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
