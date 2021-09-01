const express = require('express');
const router = express.Router();
const config = require('config');
const { ensureAuthenticated } = require('../middleware/checkAuth');

const {Link} = require('../models/Link');



//------------ Importing Controllers ------------//
const projectController = require('../controllers/projectController');
//------------ Importing Controllers ------------//
const linkController = require('../controllers/staticlinkController');



//------------ member ------------//
router.get('/member',ensureAuthenticated, (req, res) => {
    res.render('d_member',{user: req.user,active:'member'});
});
//------------edit member ------------//
router.get('/edit-user',ensureAuthenticated, (req, res) => {
    res.render('d_edit-user',{user: req.user,active:'member'});
});





//------------ document ------------//
router.get('/document',ensureAuthenticated,async (req, res) => {
    
    try {
        const links = await Link.find();
        links.host = 'http://'+config.get('host')+'/static/';
        
        res.render('d_documents',{user: req.user, links : links, active:'document'});

    }   catch(err) {
        console.log(err)
    }
});
router.get('/addlink',ensureAuthenticated, (req, res) => {

    res.render('document/d_add-link',{user: req.user,active:'document'});
});

router.get('/editlink/:_id',ensureAuthenticated, async (req, res) => {
    const _id = req.params._id;
    const link = await Link.findById({
        _id
    });
    res.render('d_edit-link',{user: req.user,link:link,active:'document'});
});

//------------ Register POST Handle ------------//
router.post('/addlink',ensureAuthenticated, linkController.addLinkHandle);

router.post('/updatelink',ensureAuthenticated, linkController.updateLinkHandle);

router.post('/deletelink',ensureAuthenticated, linkController.deleteLinkHandle);



//------------ project ------------//
router.get('/project',ensureAuthenticated, (req, res) => {
    res.render('d_project',{user: req.user,active:'project'});
});
router.get('/addproject',ensureAuthenticated, (req, res) => {
    res.render('d_add-project',{user: req.user,active:'project'});
});
//------------ Register POST Handle ------------//
router.post('/project', ensureAuthenticated,projectController.addProjectHandle);





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