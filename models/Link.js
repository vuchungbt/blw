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