const express = require('express');
const mongoose = require('mongoose');
const app = express();
const {PORT = 3000} = process.env;

const ERROR_CODE_WRONG_DATA = 400;
const ERROR_CODE_DATA_NOT_FOUND = 404;
const ERROR_CODE_DEFAULT = 500;

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
});

app.use(express.json());
app.use((req, res, next) => {
  req.user = {
    _id: '61015f29227aea0a71f83f07'
  };

  next();
});
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));


app.listen(PORT);

module.exports = {
  ERROR_CODE_DEFAULT,
  ERROR_CODE_DATA_NOT_FOUND,
  ERROR_CODE_WRONG_DATA
}

