const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//------------ Project Schema ------------//
const ProjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
  },
  status: {
    type: String,
    required: true,
    default: 'Not Started'
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User'
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

const Project = mongoose.model('Project', ProjectSchema);

module.exports = Project;