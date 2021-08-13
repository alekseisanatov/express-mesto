const router = require('express').Router();
const validator = require('validator');
const { celebrate, Joi } = require('celebrate');
const {
  getUser,
  getCurrentUser,
  getUserById,
  updateUserAvatar,
  updateUserInfo,
} = require('../controllers/users');

const checkLink = (link) => {
  const result = validator.isURL(link);
  if (result) {
    return link;
  }
  throw new Error('Url validation error');
};

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
  }),
}), updateUserInfo);
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().custom(checkLink),
  }),
}), updateUserAvatar);

module.exports = router;
