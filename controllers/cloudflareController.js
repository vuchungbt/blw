const axios = require('axios');
const config = require('config');

const Cloudflare = require('../models/Cloudflare');
const mongoose = require('mongoose');

let url = 'https://api.cloudflare.com/client/v4/zones/';


exports.listAllDNS = async (req, res) => {
  const lists = await Cloudflare.find();
  res.render('d_cloudflare',{lists,user: req.user,_active:"cloudflare"});

}

exports.addDNS = async (req, res) => { 
  const { name, ZoneID, AccountID, api_key, description,email } = req.body;
  if(!ZoneID || !api_key) {
    req.flash(
      'error_msg',
      'zoneID & Api Key not null.'
    );
    res.redirect('/home/cloudflare');
  }
  else {
        const cloudflare = new Cloudflare({
            name, ZoneID, AccountID, api_key,description,email
        });
        cloudflare.save().then(cl => {
            req.flash(
                'success_msg',
                'Submit success.'
            );
            res.redirect('/home/cloudflare');
        })
            .catch(err => console.log(err));
  }

}
exports.deleteDNSHandle = async (req, res) => {
  const { id }= req.query;
  let errors = [];

  //------------ Checking required fields ------------//
  if (!id) {
      errors.push({ msg: 'Something failed' });
  }
  if(!mongoose.Types.ObjectId.isValid(id)) {  
      errors.push({ msg: 'Something failed' });
  }
  if (errors.length > 0) {
      req.flash(
          'error_msg',
          'Something failed.'
      );
      res.redirect('/home/cloudflare');
  } else {
      const Rs = await Cloudflare.findByIdAndDelete({ _id: id });
      req.flash("success_msg", "Your link has been deleted.");
      res.redirect("/home/cloudflare");
  }
}
exports.updateDNSHandle = (req, res) => {
  const { id, name, ZoneID,email, AccountID, api_key,description} = req.body;

   //------------ Checking required fields ------------//
   if (!name || !AccountID || !api_key) {
      req.flash(
          'error_msg',
          'Please enter mandatory fields.'
      );
      res.redirect('/home/cloudflare');
  }
      //------------ Validation passed ------------//
      Cloudflare.findOne({ _id: id }).then(newdns => {

        newdns.name = name;
        newdns.ZoneID = ZoneID;
        newdns.AccountID = AccountID;
        newdns.api_key = api_key;
        newdns.email = email;
        newdns.description = description;

        newdns.save().then(link => {
                          req.flash(
                              'success_msg',
                              'Link have been updated.'
                          );
                          res.redirect('/home/cloudflare');
                      })
                      .catch(err => console.log(err));

      });
}
//======================Record=============
exports.addRecordDNS = async (req, res) => {
  const { id,ZoneID,type, address, content, api_key,ttl,proxied} = req.body;

  url+= ZoneID+ '/dns_records';
  let proxied_ =true;
  if(proxied=="false") proxied_ = false;

  let body = {
      "type": type,
      "name": address ,
      "content": content,
      "ttl": ttl,
      "proxied": proxied_
  }

  try {
      const datares = (await axios.post(url, body, {
          headers: {
              'Content-Type': 'application/json',
              'Authorization': api_key
          }
      }
      )).data;

      if (datares && datares.success == true) {
          req.flash(
              'success_msg',
              'added success!'
          );
          res.redirect('/home/update_cloudflare/'+id);
      }
      else {
          msg += datares.errors.messages;
          req.flash(
              'error_msg',
              'added fail!'
          );
          res.redirect('/home/update_cloudflare/'+id);
      }
  }
  catch (error) {
      console.error(error);
      req.flash(
          'error_msg',
          'Subdomain exist DNS'
      );
      res.redirect('/home/update_cloudflare/'+id);

  }
}
exports.updateRecordDNS = async (req, res) => {

  const { id,ZoneID,idRecord, api_key} = req.query;

  url+= ZoneID+ '/dns_records'/+idRecord;

  try {
      const datares = (await axios.delete(url, {
          headers: {
              'Content-Type': 'application/json',
              'Authorization': api_key
          }
      }
      ));

      if (datares) {
          req.flash(
              'success_msg',
              'delete success!'
          );
          res.redirect('/home/update_cloudflare/'+id);
      }
      else {
         
          req.flash(
              'error_msg',
              'delete fail!'
          );
          res.redirect('/home/update_cloudflare/'+id);
      }
  }
  catch (error) {
      console.error(error);
      req.flash(
          'error_msg',
          'some thing wrong!'
      );
      res.redirect('/home/update_cloudflare/'+id);

  }
}
exports.deleteRecordDNS = async (req, res) => {
  console.log('deleteRecordDNS');
  const { id,ZoneID,idRecord, api_key} = req.query;

  url+= ZoneID+ '/dns_records'/+idRecord;

  try {
      const datares = (await axios.delete(url, {
          headers: {
              'Content-Type': 'application/json',
              'Authorization': api_key
          }
      }
      ));

      if (datares) {
          req.flash(
              'success_msg',
              'delete success!'
          );
          res.redirect('/home/update_cloudflare/'+id);
      }
      else {
         
          req.flash(
              'error_msg',
              'delete fail!'
          );
          res.redirect('/home/update_cloudflare/'+id);
      }
  }
  catch (error) {
      console.error(error);
      req.flash(
          'error_msg',
          'some thing wrong!'
      );
      res.redirect('/home/update_cloudflare/'+id);

  }
}