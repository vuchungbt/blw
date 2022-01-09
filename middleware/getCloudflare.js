const axios = require('axios');
const config = require('config');

const Cloudflare = require('../models/Cloudflare');

let url = 'https://api.cloudflare.com/client/v4/zones/';


module.exports.listDNS = async (zoneID,apiKey) => {

    url+=zoneID+'/dns_records' ;

    try {
        const data_res = (await axios.get(url, {
            headers: {
            'Content-Type': 'application/json',
            'Authorization' : apiKey
            }
          }
        )).data;
        
        if (data_res && data_res.success==true) {
            res.render('d_cloudflare', {
                result:data_res.result,
                user: req.user, _active: 'cloudflare'
            });
        }
        else {
            req.flash(
                'error_msg',
                'Request Cloudflare failed'
            );
            res.redirect('/home/cloudflare');
        }
    }
    catch (error) {
        req.flash(
            'error_msg',
            'Request Cloudflare failed'
        );
        res.redirect('/home/cloudflare');

      }

}

module.exports.listAll = async (req,res) => { 
    const listCF = Cloudflare.find();
    
}