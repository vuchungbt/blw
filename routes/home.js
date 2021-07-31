const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/checkAuth');


//------------ dashboard me ------------//
router.get('/', (req, res) => {
    res.render('dashboard');
});
//------------ member ------------//
router.get('/member', (req, res) => {
    res.render('d_member');
});
//------------ member ------------//
router.get('/document', (req, res) => {
    res.render('d_documents');
});
//------------ member ------------//
router.get('/project', (req, res) => {
    res.render('d_project');
});


//router.get('/dashboard', ensureAuthenticated, (req,res) => res.render('home',{name: req.user.name}));

module.exports = router;