const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/checkAuth');

//------------ member ------------//
router.get('/member',ensureAuthenticated, (req, res) => {
    res.render('d_member',{name: req.user.name});
});
//------------edit member ------------//
router.get('/edit-user',ensureAuthenticated, (req, res) => {
    res.render('d_edit-user',{name: req.user.name});
});
//------------ document ------------//
router.get('/document',ensureAuthenticated, (req, res) => {
    res.render('d_documents',{name: req.user.name});
});
//------------ project ------------//
router.get('/project',ensureAuthenticated, (req, res) => {
    res.render('d_project',{name: req.user.name});
});

//------------ file ------------//
router.get('/file',ensureAuthenticated, (req, res) => {
    res.render('d_file',{name: req.user.name});
});
//------------ file ------------//
router.get('/file/id', ensureAuthenticated,(req, res) => {
    console.log('file/id');
    res.render('d_filedownload',{name: req.user.name});
});


router.get('/', ensureAuthenticated, (req,res) => {
    res.render('dashboard',{name: req.user.name});
});

module.exports = router;