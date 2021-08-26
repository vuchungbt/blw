const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/checkAuth');
//------------ Importing Controllers ------------//
const projectController = require('../controllers/projectController');

//------------ member ------------//
router.get('/member',ensureAuthenticated, (req, res) => {
    res.render('d_member',{user: req.user});
});
//------------edit member ------------//
router.get('/edit-user',ensureAuthenticated, (req, res) => {
    res.render('d_edit-user',{user: req.user});
});
//------------ document ------------//
router.get('/document',ensureAuthenticated, (req, res) => {
    res.render('d_documents',{user: req.user});
});
//------------ project ------------//
router.get('/project',ensureAuthenticated, (req, res) => {
    res.render('d_project',{user: req.user});
});
router.get('/addproject',ensureAuthenticated, (req, res) => {
    res.render('d_add-project',{user: req.user});
});
//------------ Register POST Handle ------------//
router.post('/project', projectController.addProjectHandle);

//------------ file ------------//
router.get('/file',ensureAuthenticated, (req, res) => {
    res.render('d_file',{user: req.user});
});
//------------ file ------------//
router.get('/file/id', ensureAuthenticated,(req, res) => {
    console.log('file/id');
    res.render('d_filedownload',{user: req.user});
});


router.get('/', ensureAuthenticated, (req,res) => {
    res.render('dashboard',{user: req.user});
});

module.exports = router;