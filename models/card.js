const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: (v) => /^https?:\/\/w*.?[a-zA-Z0-9_./\-#]*/gmi.test(v),
      message: 'Неправильная ссылка',
    },
  },
  owner: {
    type: String,
    required: true,
  },
  likes: [{
    type: String,
    required: true,
    default: [],
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
