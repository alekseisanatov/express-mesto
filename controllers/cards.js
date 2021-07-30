const Card = require('../models/card');
const {
  ERROR_CODE_WRONG_DATA,
  ERROR_CODE_DEFAULT,
  ERROR_CODE_DATA_NOT_FOUND,
  VALIDATION_ERROR,
  VALIDATION_ID_ERROR,
} = require('../error_codes');

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate('card')
    .then((cards) => res.status(200).send(cards))
    .catch(() => res.status(ERROR_CODE_DEFAULT).send({ message: 'Ошибка по умолчанию.' }));
};

module.exports.createCard = (req, res) => {
  const { name, link, ownerId } = req.body;

  Card.create({ name, link, owner: ownerId })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === VALIDATION_ERROR) {
        return res.status(ERROR_CODE_WRONG_DATA).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      }
      return res.status(ERROR_CODE_DEFAULT).send({ message: 'Ошибка по умолчанию.' });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params._id)
    .then((card) => {
      if (!card) {
        const error = new Error('Нет карточки по заданному id'); error.statusCode = 404; throw error;
      } else {
        res.status(200).send(card);
      }
    })
    .catch((err) => {
      if (err.name === VALIDATION_ID_ERROR) {
        return res.status(ERROR_CODE_WRONG_DATA).send({ message: 'Карточка по указанному _id не найдена.' });
      }
      if (err.statusCode === ERROR_CODE_DATA_NOT_FOUND) {
        return res.status(404).send({ message: 'Нет карточки по заданному id' });
      }
      return res.status(ERROR_CODE_DEFAULT).send({ message: 'Ошибка по умолчанию.' });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        const error = new Error('Нет карточки по заданному id'); error.statusCode = 404; throw error;
      } else {
        res.status(200).send(card);
      }
    })
    .catch((err) => {
      if (err.name === VALIDATION_ID_ERROR) {
        return res.status(ERROR_CODE_WRONG_DATA).send({ message: 'Карточка с указанным _id не найдена.' });
      }
      if (err.statusCode === ERROR_CODE_DATA_NOT_FOUND) {
        return res.status(404).send({ message: 'Нет карточки по заданному id' });
      }
      return res.status(ERROR_CODE_DEFAULT).send({ message: 'Ошибка по умолчанию.' });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) {
        const error = new Error('Нет карточки по заданному id'); error.statusCode = 404; throw error;
      } else {
        res.status(200).send(card);
      }
    })
    .catch((err) => {
      if (err.name === VALIDATION_ID_ERROR) {
        return res.status(ERROR_CODE_WRONG_DATA).send({ message: 'Карточка с указанным _id не найдена.' });
      }
      if (err.statusCode === ERROR_CODE_DATA_NOT_FOUND) {
        return res.status(404).send({ message: 'Нет карточки по заданному id' });
      }
      return res.status(ERROR_CODE_DEFAULT).send({ message: 'Ошибка по умолчанию.' });
    });
};
