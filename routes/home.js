const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/checkAuth');


//------------ dashboard me ------------//
//router.get('/', (req, res) => {
//    res.render('dashboard');
//});
//------------ member ------------//
router.get('/member', (req, res) => {
    res.render('d_member');
});
//------------ document ------------//
router.get('/document', (req, res) => {
    res.render('d_documents');
});
//------------ project ------------//
router.get('/project', (req, res) => {
    res.render('d_project');
});

//------------ file ------------//
router.get('/file', (req, res) => {
    res.render('d_file');
});
//------------ file ------------//
router.get('/file/id', (req, res) => {
    console.log('file/id');
    res.render('d_filedownload');
});


router.get('/', ensureAuthenticated, (req,res) => res.render('dashboard',{name: req.user.name}));

module.exports = router;