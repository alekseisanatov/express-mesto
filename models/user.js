const mongoose = require('mongoose');
const AuthError = require('../errors/AuthError');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    minlength: 2,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    minlength: 8,
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
    validate: {
      validator: function (v) {
        return /\^(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*/gmx.test(v);
      },
      message: props => `${props.value} is not a valid link`
    },
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new AuthError('Неправильные почта или пароль');
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new AuthError('Неправильные почта или пароль');
          }
          return user;
        })
        .catch(next);
    })
};

module.exports = mongoose.model('user', userSchema);
