const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//------------ User Schema ------------//
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
  },
  email: {
    type: String,
    required: true
  },
  permission: {
    type: String,
    default:'Member',
    required: true
  },
  active: {
    type: String,
    required: true,
    default:'Disable'
  },
  password: {
    type: String,
    required: true
  },
  verified: {
    type: Boolean,
    default: false
  },
  resetLink: {
    type: String,
    default: ''
  },
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

module.exports = User;
module.exports.User = User;