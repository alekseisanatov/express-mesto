const express = require('express');
const mongoose = require('mongoose');
const validator = require('validator');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { celebrate, Joi, errors } = require('celebrate');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const NotFoundError = require('./errors/NotFoundError');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { corsOptions } = require('./cors/corsOptions');

const app = express();
const { PORT = 3000 } = process.env;
const checkLink = (link) => {
  const result = validator.isURL(link);
  if (result) {
    return link;
  }
  throw new Error('URL validation error');
};

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(express.json());
app.use(cookieParser());
app.use(requestLogger); // подключаем логгер запросов
app.use(cors(corsOptions)); //включаем защиту cors

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom(checkLink),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  }),
}), createUser);

app.use(auth);
app.use('/users', require('./routes/users'));

app.use('/cards', require('./routes/cards'));

app.use((req, res, next) => {
  next(new NotFoundError('Вы перешли на несуществующий роут'));
});
app.use(errorLogger); // подключаем логгер ошибок

app.use(errors());
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode)
    .send({
      message: statusCode === 500 ? 'На сервере произошла ошибка' : message,
    });
  next();
});

app.listen(PORT);
