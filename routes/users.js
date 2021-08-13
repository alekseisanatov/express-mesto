const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUser,
  getCurrentUser,
  getUserById,
  updateUserAvatar,
  updateUserInfo,
} = require('../controllers/users');

router.get('/', getUser);
router.get('/me', getCurrentUser);
router.get('/:userId', celebrate({
  body: Joi.object().keys({
    userId: Joi.string().length(24).hex(),
  }),
}), getUserById);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
    id: Joi.string().length(24).hex(),
  }),
}), updateUserInfo);
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required(),
    id: Joi.string().length(24).hex(),
  }),
}), updateUserAvatar);

module.exports = router;
