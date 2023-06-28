const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();
const {
  createCard, getCards, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

router.get('/', getCards);
router.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum(),
  }),
}), deleteCard);
router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().regex(/^https?:\/\/w*.?[a-zA-Z0-9_./\-#]*/i),
    likes: Joi.array().items(Joi.string().required()),
    createdAt: Joi.date(),
  }),
}), createCard);
router.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum(),
  }),
}), likeCard);
router.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum(),
  }),
}), dislikeCard);

module.exports = router;
