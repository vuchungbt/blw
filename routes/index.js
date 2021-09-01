const express = require('express');
const router = express.Router();

const  Link  = require('../models/Link');

//------------ Welcome Route ------------//
router.get('/', (req, res) => {
    res.render('welcome');
});
//------------ public ------------//
router.get('/public', (req, res) => {
    res.render('public');
});

//------------ about me ------------//
router.get('/about', (req, res) => {
    res.render('about');
});
//------------ static link ------------//
router.get('/static/:_link', async(req, res) => {

    const _link = req.params._link;
    console.log("LINK:", _link);
    try {
        const link = await Link.findOne({ linkstatic: _link });
      
        if (link.status!=='Disable') {
            res.render('document/staticlink', {link:link});
        }
        else {
            res.render('404');
        }
    } catch (error) {
        console.log(error);
    }
});


module.exports = router;