const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUser,
  getUserById,
  updateUserAvatar,
  updateUserInfo,
} = require('../controllers/users');

router.get('/', getUser);
router.get('/:userId', getUserById);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
}), updateUserInfo);
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required(),
  }),
}), updateUserAvatar);

module.exports = router;
