const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//------------ Project Schema ------------//
const ProjectSchema = new mongoose.Schema({
  projectname: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true,
    unique:true
  },
  filenginx: {
    type: String,
    default:''
  },
  projectstatus: {
    type: String,
    required: true
  },
  projectbody: {
    type: String,
    required: true
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  pages: [{
    type: Schema.Types.ObjectId,
    ref: 'Page',
  }],
  logo :{
    type: String
  },
  meta_image :{
    type: String
  },
  meta_description :{
    type: String
  },
  meta_link1 :{
    type: String
  },
  meta_link2 :{
    type: String
  }

}, { timestamps: true });

const Project = mongoose.model('Project', ProjectSchema);

module.exports = Project;
module.exports.Project = Project;