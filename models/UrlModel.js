const mongoose = require('mongoose');

const { Schema } = mongoose;

const Url = new Schema({
  urlId: {
    type: Number,
    default: 1,
    required: true,
  },
  originalUrl: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    default: Date.now(),
  }
});

module.exports = mongoose.model('Url', Url);
