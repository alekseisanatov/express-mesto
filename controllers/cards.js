const Card = require('../models/card');
const NotFoundError = require('../errors/NotFoundError');
const WrongData = require('../errors/WrongData');
const AccessingError = require('../errors/AccessingError');
const {
  ERROR_CODE_WRONG_DATA,
  VALIDATION_ERROR,
  VALIDATION_ID_ERROR,
} = require('../errors/error_codes');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate('card')
    .then((cards) => res.status(200).send(cards))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === VALIDATION_ERROR) {
        next(new WrongData('Переданы некорректные данные при создании карточки.'));
      } else {
        next();
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (card.owner.toString() === req.user._id) {
        card
          .delete()
          .then((data) => res.send(data))
          .catch(() => next());
      } else {
        next(new AccessingError('Нет прав на удаление карточки'));
      }
    })
    .catch(() => next(new NotFoundError('Нет карточки по заданному id')));
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Нет карточки по заданному id'));
      } else {
        res.status(200).send(card);
      }
    })
    .catch((err) => {
      if (err.name === VALIDATION_ID_ERROR) {
        return res.status(ERROR_CODE_WRONG_DATA).send({ message: 'Карточка по указанному _id не найдена.' });
      }
      return next();
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Нет карточки по заданному id'));
      } else {
        res.status(200).send(card);
      }
    })
    .catch((err) => {
      if (err.name === VALIDATION_ID_ERROR) {
        return res.status(ERROR_CODE_WRONG_DATA).send({ message: 'Карточка по указанному _id не найдена.' });
      }
      return next();
    });
};
