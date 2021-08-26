const express = require('express');
const router = express.Router();

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


module.exports = router;