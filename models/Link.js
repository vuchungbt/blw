const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//------------ Link Schema ------------//
const LinkSchema = new mongoose.Schema({
  linkname: {
    type: String
  },
  linkstatic: {
    type: String,
    require: true
  },
  header: {
    type: String
  },
  area: {
    type: String
  },
  footer: {
    type: String
  },
  description: {
    type: String
  },
  meta_image: {
    type: String
  },
  status: {
    type: String,
    default:'Enable'
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  modified: {
    type: Date
  }
}, { timestamps: true });

const Link = mongoose.model('Link', LinkSchema);

module.exports = Link;
module.exports.Link = Link;