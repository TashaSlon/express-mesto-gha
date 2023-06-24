const router = require('express').Router();
const {
  createUser, getUsers, getUser, updateProfile, updateAvatar,
} = require('../controllers/users');

router.get('/:userId', getUser);
router.get('/', getUsers);
router.post('/', createUser);
router.patch('/me', updateProfile);
router.patch('/me/avatar', updateAvatar);

module.exports = router;
