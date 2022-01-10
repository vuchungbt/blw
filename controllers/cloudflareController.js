const axios = require('axios');
const config = require('config');

const Cloudflare = require('../models/Cloudflare');

let url = 'https://api.cloudflare.com/client/v4/zones/';


function listDNS (zoneID,apiKey) {

    url+=zoneID+'/dns_records' ;

    try {
        const data_res = (axios.get(url, {
            headers: {
            'Content-Type': 'application/json',
            'Authorization' : apiKey
            }
          }
        )).data;
        
        return data_res ;
    }
    catch (error) {
        return null ;
      }

}

exports.listAllDNS = async (req, res) => {

  const list = await Cloudflare.find(); 
  if(list)  {
    list.forEach(elm => {
      elm.record = listDNS(elm.ZoneID,ZoneID.api_key);
    });
  }

  console.log('listRecord >>>> ',list);
  res.render('d_cloudflare',{user: req.user,_active:"cloudflare"});

}

exports.addDNS = async (req, res) => { 
  const { name, ZoneID, AccountID, api_key } = req.body;
  if(!ZoneID || !api_key) {
    req.flash(
      'error_msg',
      'zoneID & Api Key not null.'
    );
    res.redirect('/home/cloudflare');
  }
  else {
        const cloudflare = new Cloudflare({
            name, ZoneID, AccountID, api_key
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

