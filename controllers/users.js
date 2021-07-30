const User = require('../models/user');
const {
  ERROR_CODE_WRONG_DATA,
  ERROR_CODE_DEFAULT,
  ERROR_CODE_DATA_NOT_FOUND,
  VALIDATION_ERROR,
  VALIDATION_ID_ERROR,
} = require('../error_codes');

module.exports.getUser = (req, res) => {
  User.find({})
    .then((user) => res.status(200).send(user))
    .catch(() => res.status(ERROR_CODE_DEFAULT).send({ message: 'Ошибка по умолчанию.' }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params._id)
    .then((user) => {
      if (!user) {
        const error = new Error('Нет пользователя по заданному id'); error.statusCode = 404; throw error;
      } else {
        res.status(200).send(user);
      }
    })
    .catch((err) => {
      if (err.name === VALIDATION_ID_ERROR) {
        return res.status(ERROR_CODE_WRONG_DATA).send({ message: 'Пользователь по указанному _id не найден.' });
      }
      if (err.statusCode === ERROR_CODE_DATA_NOT_FOUND) {
        return res.status(404).send({ message: 'Нет пользователя по заданному id' });
      }
      return res.status(ERROR_CODE_DEFAULT).send({ message: 'Ошибка по умолчанию.' });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === VALIDATION_ERROR) {
        return res.status(ERROR_CODE_WRONG_DATA).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      }
      return res.status(ERROR_CODE_DEFAULT).send({ message: 'Ошибка по умолчанию.' });
    });
};

module.exports.updateUserInfo = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.params._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        const error = new Error('Нет пользователя по заданному id'); error.statusCode = 404; throw error;
      } else {
        res.status(200).send(user);
      }
    })
    .catch((err) => {
      if (err.name === VALIDATION_ID_ERROR) {
        return res.status(ERROR_CODE_WRONG_DATA).send({ message: 'Невалидный id' });
      }
      if (err.statusCode === ERROR_CODE_DATA_NOT_FOUND) {
        return res.status(404).send({ message: 'Нет пользователя по заданному id' });
      }
      return res.status(ERROR_CODE_DEFAULT).send({ message: 'Ошибка по умолчанию.' });
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        const error = new Error('Нет пользователя по заданному id'); error.statusCode = 404; throw error;
      } else {
        res.status(200).send(user);
      }
    })
    .catch((err) => {
      if (err.name === VALIDATION_ID_ERROR) {
        return res.status(ERROR_CODE_WRONG_DATA).send({ message: 'Невалидный id' });
      }
      if (err.statusCode === ERROR_CODE_DATA_NOT_FOUND) {
        return res.status(404).send({ message: 'Нет пользователя по заданному id' });
      }
      return res.status(ERROR_CODE_DEFAULT).send({ message: 'Ошибка по умолчанию.' });
    });
};
