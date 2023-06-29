const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUsers, getUser, updateProfile, updateAvatar, getProfile,
} = require('../controllers/users');

router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum(),
  }),
}), getUser);
router.get('/', getUsers);
router.get('/me', getProfile);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    email: Joi.string().regex(/^[a-z0-9._%+-]+@[a-z0-9-]+.+.[a-z]{2,4}$/i),
    password: Joi.string().min(8),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(/^https?:\/\/w*.?[a-zA-Z0-9_./\-#]*/i),
  }),
}), updateProfile);
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().regex(/^https?:\/\/w*.?[a-zA-Z0-9_./\-#]*/i),
  }),
}), updateAvatar);

module.exports = router;
