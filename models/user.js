const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = mongoose.model('User', new Schema({
    email: {
        type: String,
        required: true,
        unique: true
      },
      name: {
        type: String
      },
}));