const Card = require('../models/card');
const {ERROR_CODE_WRONG_DATA, ERROR_CODE_DEFAULT, ERROR_CODE_DATA_NOT_FOUND} = require('../app');

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate('card')
    .then(cards => res.status(200).send(cards))
    .catch((err) => {
      if(err.status === ERROR_CODE_WRONG_DATA) {
        return res.status(ERROR_CODE_WRONG_DATA).send({message: 'Переданы некорректные данные при создании карточки.'})
      } else {
        return res.status(ERROR_CODE_DEFAULT).send({message: 'Ошибка по умолчанию.'})
      }
    })
}

module.exports.createCard = (req, res) => {
  const {name, link, ownerId} = req.body;

  Card.create({name, link, owner: ownerId})
    .then(card => res.status(200).send(card))
    .catch((err) => {
      if(err.status === ERROR_CODE_WRONG_DATA) {
        return res.status(ERROR_CODE_WRONG_DATA).send({message: 'Переданы некорректные данные при создании карточки.'})
      } else {
        return res.status(ERROR_CODE_DEFAULT).send({message: 'Ошибка по умолчанию.'})
      }
    })
}

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.user._id)
    .then(card => res.status(200).send(card))
    .catch((err) => {
      if(err.status === ERROR_CODE_DATA_NOT_FOUND) {
        return res.status(ERROR_CODE_DATA_NOT_FOUND).send({message: 'Карточка с указанным _id не найдена.'})
      }
    })
}

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then(card => res.status(200).send(card))
    .catch((err) => {
      if(err.status === ERROR_CODE_WRONG_DATA) {
        return res.status(ERROR_CODE_WRONG_DATA).send({message: 'Переданы некорректные данные для постановки/снятии лайка.'})
      } else {
        return res.status(ERROR_CODE_DEFAULT).send({message: 'Ошибка по умолчанию.'})
      }
    })
}

module.exports.dislikeCard = (req, res) => {Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } }, // убрать _id из массива
  { new: true },
  )
  .then(card => res.status(200).send(card))
  .catch((err) => {
    if(err.status === ERROR_CODE_WRONG_DATA) {
      return res.status(ERROR_CODE_WRONG_DATA).send({message: 'Переданы некорректные данные для постановки/снятии лайка.'})
    } else {
      return res.status(ERROR_CODE_DEFAULT).send({message: 'Ошибка по умолчанию.'})
    }
  })
}