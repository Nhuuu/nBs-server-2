const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const drinkSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 99
  },
  brand: { // 
    type: String,
    required: true,
    minlength: 1,
    maxlength: 99
  },
  type: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 99
  },
  subtype: {
    type: String,
    minlength: 1,
    maxlength: 99
  },
  price: {
    type: Number,
    minlength: 1,
    maxlength: 99
  },
  desc: {
    type: String,
    maxlength: 250
  },
  image: String,
  userId: {
  	type: mongoose.Schema.Types.ObjectId,
  	ref: 'User'
  }
});


// Exporting the Drink model
module.exports = mongoose.model('Drink', drinkSchema);
