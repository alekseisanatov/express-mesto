const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const AuthError = require('../errors/AuthError');

const validateUrl = function (url) {
  // eslint-disable-next-line
  const regex = /(https?:\/\/)(www\.)?([\w\-_]{1,})\.([\w\-.?=&,;\/@*+:]{1,})/;
  return regex.test(url);
};

const validateEmail = function (email) {
  const regex = /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/;
  return regex.test(email);
};

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    minlength: 2,
    required: true,
    unique: true,
    validate: [validateEmail, 'Неправильная почта'],
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    validate: [validateUrl, 'Неправильная ссылка'],
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
});

userSchema.statics.findUserByCredentials = function (email, password, next) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        next(new AuthError('Неправильные почта или пароль'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            next(new AuthError('Неправильные почта или пароль'));
          }
          return user;
        });
    });
};

function toJSON() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
}

userSchema.methods.toJSON = toJSON;

module.exports = mongoose.model('user', userSchema);
