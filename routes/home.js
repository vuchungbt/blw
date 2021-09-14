const express = require('express');
const router = express.Router();
const config = require('config');
const { ensureAuthenticated } = require('../middleware/checkAuth');
const mongoose = require('mongoose');
const {Link} = require('../models/Link');
const {User} = require('../models/User');



//------------ Importing Controllers ------------//
const projectController = require('../controllers/projectController');

const linkController = require('../controllers/staticlinkController');

const userController = require('../controllers/userController');



//------------ member ------------//
router.get('/member',ensureAuthenticated,async (req, res) => {
    try { 
        const users = await User.find();
        res.render('d_member',{user: req.user,users,_active:'member'});
    }
    catch(err) {
        console.log(err);
        res.render('404');
    }
});
//------------edit member ------------//
router.get('/edit-user/:_id',ensureAuthenticated,async (req, res) => {
    
    const _id = req.params._id;
    if(!mongoose.Types.ObjectId.isValid(_id)) { 
        res.render('404');
    }
    const userEdit = await User.findById({
        _id
    });
    console.log('userEdit >' ,userEdit);
    if(userEdit)
        res.render('member/d_edit-user',{user: req.user,_active:'member',
        name :userEdit.name,
        phone :userEdit.phone,
        email : userEdit.email,
        permission: userEdit.permission,
        active:userEdit.active,
        id:userEdit._id,
    });
    else res.render('404');
});
router.post('/updateuser',ensureAuthenticated, userController.updateMemberHandle);
router.post('/deleteuser',ensureAuthenticated, userController.deleteMemberHandle);
router.post('/adduser',ensureAuthenticated, userController.addMemberHandle);





//------------ document ------------//
router.get('/document',ensureAuthenticated,async (req, res) => {
    
    try {
        const links = await Link.find();
        links.host = 'http://'+req.headers.host+'/static/';
        
        res.render('d_documents',{user: req.user, links : links, _active:'document'});

    }   catch(err) {
        console.log(err);
        res.render('404');
    }
});
router.get('/addlink',ensureAuthenticated, (req, res) => {

    res.render('document/d_add-link',{user: req.user,_active:'document'});
});

router.get('/editlink/:_id',ensureAuthenticated, async (req, res) => {
    const _id = req.params._id;
    if(!mongoose.Types.ObjectId.isValid(_id)) { 
        res.render('404');
    }
    const link = await Link.findById({
        _id
    });
    if(link)
        res.render('document/d_edit-link',{user: req.user,link:link,_active:'document'});
    else res.render('404');
});

//------------ Register POST Handle ------------//
router.post('/addlink',ensureAuthenticated, linkController.addLinkHandle);

router.post('/updatelink',ensureAuthenticated, linkController.updateLinkHandle);

router.post('/deletelink',ensureAuthenticated, linkController.deleteLinkHandle);



//------------ project ------------//
router.get('/project',ensureAuthenticated, (req, res) => {
    res.render('d_project',{user: req.user,_active:'project'});
});
router.get('/addproject',ensureAuthenticated, (req, res) => {
    res.render('d_add-project',{user: req.user,_active:'project'});
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
    res.render('dashboard',{user: req.user,_active:"home"});
});

module.exports = router;