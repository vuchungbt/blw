const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/checkAuth');

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



//router.get('/dashboard', ensureAuthenticated, (req,res) => res.render('home',{name: req.user.name}));

module.exports = router;