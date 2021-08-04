const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const WrongData = require('../errors/WrongData');
const WrongEmailError = require('../errors/WrongEmailError');
const {
  ERROR_CODE_WRONG_DATA,
  VALIDATION_ERROR,
  VALIDATION_ID_ERROR,
} = require('../error_codes');

module.exports.getUser = (req, res) => {
  User.find({})
    .then((user) => res.status(200).send(user))
    .catch(next);
};

module.exports.getUserById = (req, res) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет пользователя по заданному id');
      } else {
        res.status(200).send(user);
      }
    })
    .catch(next);
};

module.exports.createUser = (req, res) => {
  const {
    name = '',
    about,
    avatar,
  } = req.body;

  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email: req.body.email,
      password: hash,
    }))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === VALIDATION_ERROR) {
        throw new WrongData('Переданы некорректные данные при создании пользователя.');
      } else if (err.name === 'MongoError' && err.code === 11000) {
        throw new WrongEmailError('Пользователь с данной почтой уже существует');
      } else {
        next();
      }
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      res.send({
        token: jwt.sign({ _id: user._id }, '61016079fc6bef0a856b1dcc', { expiresIn: '7d' }),
      });
    })
    .catch(next);
};

module.exports.updateUserInfo = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет пользователя по заданному id');
      } else {
        res.status(200).send(user);
      }
    })
    .catch((err) => {
      if (err.name === VALIDATION_ID_ERROR) {
        return res.status(ERROR_CODE_WRONG_DATA).send({ message: 'Невалидный id' });
      } else {
        next();
      }
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет пользователя по заданному id');
      } else {
        res.status(200).send(user);
      }
    })
    .catch((err) => {
      if (err.name === VALIDATION_ID_ERROR) {
        return res.status(ERROR_CODE_WRONG_DATA).send({ message: 'Невалидный id' });
      }
      return next();
    });
};
