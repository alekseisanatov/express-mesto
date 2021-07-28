const User = require('../models/user');
const {ERROR_CODE_WRONG_DATA, ERROR_CODE_DEFAULT, ERROR_CODE_DATA_NOT_FOUND} = require('../app');


module.exports.getUser = (req,res) => {
  User.find({})
    .then(user => res.status(200).send(user))
    .catch((err) => {
      if(err.status === ERROR_CODE_WRONG_DATA) {
        return res.status(ERROR_CODE_WRONG_DATA).send({message: 'Переданы некорректные данные при создании пользователя.'})
      } else {
        return res.status(ERROR_CODE_DEFAULT).send({message: 'Ошибка по умолчанию.'})
      }
    })
}

module.exports.getUserById = (req, res) => {
  User.findById(req.user._id)
    .then(user => res.status(200).send(user))
    .catch((err) => {
      if(err.status === ERROR_CODE_DATA_NOT_FOUND) {
        return res.status(ERROR_CODE_DATA_NOT_FOUND).send({message: 'Пользователь по указанному _id не найден.'})
      } else {
        return res.status(ERROR_CODE_DEFAULT).send({message: 'Ошибка по умолчанию.'})
      }
    })
}

module.exports.createUser = (req, res) => {
  const {name, about, avatar} = req.body;

  User.create({name, about, avatar})
    .then(user => res.status(200).send(user))
    .catch((err) => {
      if(err.status === ERROR_CODE_WRONG_DATA) {
        return res.status(ERROR_CODE_WRONG_DATA).send({message: 'Переданы некорректные данные при создании пользователя.'})
      } else {
        return res.status(ERROR_CODE_DEFAULT).send({message: 'Ошибка по умолчанию.'})
      }
    })
}

module.exports.updateUserInfo = (req, res) => {
  const {name, about} = req.body;

  User.findByIdAndUpdate(req.user._id, {name, about})
    .then(user => res.send(user))
    .catch((err) => {
      if(err.status === ERROR_CODE_WRONG_DATA) {
        return res.status(ERROR_CODE_WRONG_DATA).send({message: 'Переданы некорректные данные при создании пользователя.'})
      } else if(err.status === ERROR_CODE_DATA_NOT_FOUND){
        return res.status(ERROR_CODE_DATA_NOT_FOUND).send({message: 'Пользователь с указанным _id не найден.'})
      } else {
        return res.status(ERROR_CODE_DEFAULT).send({message: 'Ошибка по умолчанию.'})
      }
    })
}

module.exports.updateUserAvatar = (req, res) => {
  const {avatar} = req.body;

  User.findByIdAndUpdate(req.user._id, {avatar})
    .then(user => res.send(user))
    .catch((err) => {
      if(err.status === ERROR_CODE_WRONG_DATA) {
        return res.status(ERROR_CODE_WRONG_DATA).send({message: 'Переданы некорректные данные при создании пользователя.'})
      } else if(err.status === ERROR_CODE_DATA_NOT_FOUND){
        return res.status(ERROR_CODE_DATA_NOT_FOUND).send({message: 'Пользователь с указанным _id не найден.'})
      } else {
        return res.status(ERROR_CODE_DEFAULT).send({message: 'Ошибка по умолчанию.'})
      }
    })
}