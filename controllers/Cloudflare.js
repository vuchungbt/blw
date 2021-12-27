const axios = require('axios');
const config = require('config');

exports.listDNS = async (req,res) => {

    let url = 'https://api.cloudflare.com/client/v4/zones/'+config.get('DNSzoneID')+'/dns_records';

    try {
        const data_res = (await axios.get(url, {
            headers: {
            'Content-Type': 'application/json',
            'Authorization' : config.get('CLAPIKey')
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