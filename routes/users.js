const router = require('express').Router();
const {
  getUsers, getUser, updateProfile, updateAvatar, getProfile,
} = require('../controllers/users');

router.get('/:userId', getUser);
router.get('/', getUsers);
router.get('/me', getProfile);
router.patch('/me', updateProfile);
router.patch('/me/avatar', updateAvatar);

module.exports = router;
