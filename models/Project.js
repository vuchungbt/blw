const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//------------ Project Schema ------------//
const ProjectSchema = new mongoose.Schema({
  projectname: {
    type: String,
    required: true
  },
  projectdescription: {
    type: String,
  },
  projectactive: {
    type: String,
    required: true,
    default: 'Enable'
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  modified: {
    type: Date
  }
}, { timestamps: true });

const Project = mongoose.model('Project', ProjectSchema);

module.exports = Project;