const express = require('express');
const router = express.Router();
const config = require('config');
const { ensureAuthenticated } = require('../middleware/checkAuth');
const mongoose = require('mongoose');
const {Link} = require('../models/Link');
const {User} = require('../models/User');
const {Project} = require('../models/Project');
const {Page} = require('../models/Page');



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
router.post('/myprofile',ensureAuthenticated, userController.updateMyprofileHandle);
router.post('/updatemypassword',ensureAuthenticated, userController.updatePassprofileHandle);





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

router.get('/clone/:_id',ensureAuthenticated, async (req, res) => {
    const _id = req.params._id;
    if(!mongoose.Types.ObjectId.isValid(_id)) { 
        res.render('404');
    }
    const link = await Link.findById({
        _id
    });
    if(link)
        res.render('document/d_add-link',{user: req.user,
            linkname:link.linkname,
            linkstatic:link.linkstatic+"-2",
            header:link.header,
            area:link.area,
            footer:link.footer,
            _active:'document'});
    else res.render('404');
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
router.get('/project',ensureAuthenticated, async (req, res) => {
    try {
        const project = await Project.find();
        console.log(project);
        res.render('d_project',{ projects:project, user: req.user,_active:'project'});

    }   catch(err) {
        console.log(err);
        res.render('404');
    }
    
});
router.get('/addproject',ensureAuthenticated, (req, res) => {
    res.render('project/d_add-project',{user: req.user,_active:'project'});
});

router.get('/editproject/:_id',ensureAuthenticated, (req, res) => {
    const _id = req.params._id;
    if(!mongoose.Types.ObjectId.isValid(_id)) { 
        res.render('404');
    }
    Project.findById({
        _id
    }).then(project =>{
          
        let listpages = [];
        project.pages.forEach(pageId => {
            Page.findById({
                _id:pageId
            }).then(page => {
                listpages.push(page);
            });
            
        });
        project.pagelist=listpages;
        
        if(project)
            res.render('project/d_edit-project',{user: req.user,project:project,_active:'project'});
        else res.render('404');
    }).catch(err => {
        console.log(err);
        res.render('404');
    });;

    
});
router.get('/viewporject',ensureAuthenticated, (req, res) => {
    res.render('project/viewproject');
});
//------------ Register POST Handle ------------//
router.post('/project', ensureAuthenticated,projectController.addProjectHandle);
//------------ Register POST Handle ------------//
router.post('/deleteproject',ensureAuthenticated, projectController.deleteProjectHandle);





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