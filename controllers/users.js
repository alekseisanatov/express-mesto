const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const { NODE_ENV, JWT_SECRET } = process.env;
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const WrongData = require('../errors/WrongData');
const WrongEmailError = require('../errors/WrongEmailError');
const AuthError = require('../errors/AuthError');

module.exports.getUser = (req, res, next) => {
  User.find({})
    .then((user) => res.status(200).send(user))
    .catch(next);
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Нет пользователя'));
      } else {
        res.status(200).send(user);
      }
    })
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => res.status(200).send(user))
    .catch(() => next(new NotFoundError('Нет пользователя по заданному id')));
};

module.exports.createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
  } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (user) {
        next(new WrongEmailError('Пользователь с данной почтой уже существует'));
      } else {
        bcrypt.hash(req.body.password, 10)
          .then((hash) => User.create({
            name,
            about,
            avatar,
            email,
            password: hash,
          }))
          .then((userData) => res.status(201).send({ userData: userData.toJSON() }))
          .catch((err) => {
            if (err.name === 'MongoError' && err.code === 11000) {
              next(new WrongEmailError('Пользователь с данной почтой уже существует'));
            }
          });
      }
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res
        .cookie('jwt', token, {
          httpOnly: true,
          sameSite: true,
        })
        .status(200)
        .send({ message: 'jwt создан' });
    })
    .catch(() => next(new AuthError('Такого пользователя нет')));
};

module.exports.updateUserInfo = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Нет пользователя по заданному id'));
      } else {
        res.status(200).send(user);
      }
    })
    .catch(() => next(new WrongData('Невалидный id')));
};

module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Нет пользователя по заданному id'));
      } else {
        res.status(200).send(user);
      }
    })
    .catch(() => next(new WrongData('Невалидный id')));
};
