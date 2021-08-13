const mongoose = require('mongoose');

const validateUrl = function (url) {
  // eslint-disable-next-line
  const regex = /(https?:\/\/)(www\.)?([\w\-_]{1,})\.([\w\-.?=&,;\/@*+:]{1,})/;
  return regex.test(url);
};

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    required: true,
    type: String,
    validate: [validateUrl, 'Неправильная ссылка'],
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    default: [],

  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
