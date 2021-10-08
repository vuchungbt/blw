const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//------------ Project Schema ------------//
const PageSchema = new mongoose.Schema({
  page_name: {
    type: String,
    required: true
  },
  page_address: {
    type: String,
    required: true
  },
  page_status: {
    type: String,
    required:true
  },
  page_body: {
    type: String,
    required:true
  },
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

const Page = mongoose.model('Page', PageSchema);

module.exports = Page;