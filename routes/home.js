const express = require('express');
const router = express.Router();
const config = require('config');

const axios = require('axios');

const fs = require("fs");

const { ensureAuthenticated } = require('../middleware/checkAuth');

const { uploadImage,uploadFile } = require('../middleware/uploadFile');

const mongoose = require('mongoose');
const {Link} = require('../models/Link');
const {User} = require('../models/User');
const {Project} = require('../models/Project');
const {Page} = require('../models/Page');
const {Resources} = require('../models/Resources');
const {Cloudflare} = require('../models/Cloudflare');


//------------ Importing Controllers ------------//
const projectController = require('../controllers/projectController');

const linkController = require('../controllers/staticlinkController');

const userController = require('../controllers/userController');

const resourceController = require('../controllers/resourceController');

const cloudflareController = require('../controllers/cloudflareController');

const nginxController = require('../controllers/nginxController');

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

router.get('/addlink/:_id',ensureAuthenticated, async (req, res) => {
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
        project.host = req.headers.host;
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

        Page.find({
            '_id': { 
                $in: project.pages.map(p => mongoose.Types.ObjectId(p))
            }
        }).then(pages => {
            project.pagelist = pages;
            if(project)
                res.render('project/d_edit-project',{user: req.user,project:project,_active:'project'});
            else 
                res.render('404');
        });
        
        // project.pages.forEach(pageId => {
        //     Page.findById({
        //         _id:pageId
        //     }).then(page => {
        //         listpages.push(page);
        //     });
            
        // });
        // project.pagelist=listpages;
        
        // if(project)
        //     res.render('project/d_edit-project',{user: req.user,project:project,_active:'project'});
        // else res.render('404');
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
//------------ Delete POST Handle ------------//
router.post('/deleteproject',ensureAuthenticated, projectController.deleteProjectHandle);
//------------ Update POST Handle ------------//
router.post('/updateproject', ensureAuthenticated,projectController.updateProjectHandle);
router.post('/getcontentdeploy', ensureAuthenticated,projectController.getdeployProjectHandle);
router.post('/deployproject', ensureAuthenticated,projectController.deployProjectHandle);




//------------ file ------------//
router.get('/file',ensureAuthenticated, (req, res) => {
    fs.readdir('./uploads', function (err, files) {
        //handling error
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        } 
        //files.reverse();
        console.log(files); 

        files.host ='http://blwsmartware.net';
        res.render('d_file',{user: req.user,files:files,_active:'file'});
    });
    
});
//------------ upload image ------------//
router.get('/img',ensureAuthenticated, (req, res) => {
    console.log('img');
    res.render('updownload/upload_image',{user: req.user});
    
});
//------------ upload file ------------//
router.get('/viewupload',ensureAuthenticated, (req, res) => {
    console.log('viewupload');
    res.render('updownload/upload_file',{user: req.user});
    
});

router.post("/imgupload", function(req, res) {
    
    uploadImage(req, res, function(err) {
        console.log('=============img=============\n',req.files);
        if (err) {
            console.log('Something went wrong :',err);
            return res.status(400).json({
                status: 400,
                msg:err
            });
        }
        console.log('Image uploaded sucessfully');
        return res.status(200).json({
            status: 200,
            file:req.files,
            host:'http://blwsmartware.net'
        });
    });
});

router.post("/fileupload", function(req, res) {
    
    uploadFile(req, res, function(err) {
        console.log('=============file=============\n',req.files);
        if (err) {
            console.log('Something went wrong');
            return res.status(400).json({
                status: 400,
                msg:'Fail,Something went wrong'
            });
        }
        console.log('File uploaded sucessfully');
        return res.status(200).json({
            status: 200,
            file:req.files,
            host:'http://blwsmartware.net',
            msg:'Done'
        });
    });
});

// router.get("/removeimage/:_name", function(req, res) { 
//     const _name = req.params._name;
//     fs.unlink('./uploads/'+_name, function (err) {
//         if (err) {
//             console.log(err);
//             res.render('404');
//         }
//         else {
//             console.log('File deleted!',_name);
//             req.flash(
//                 'error_msg',
//                 'File Deleted success'
//             );
//             res.redirect('/home/file');
//         }

//       });
// });
router.get("/removefile/:_name", function(req, res) { 
    const _name = req.params._name;
    fs.unlink('./uploads/'+_name, function (err) {
        if (err) {
            console.log(err);
            res.render('404');
        }
        else {
            console.log('File deleted!',_name);
            req.flash(
                'error_msg',
                'File Deleted success'
            );
            res.redirect('/home/file');
        }

      });
});

router.get('/cloudflare',ensureAuthenticated, cloudflareController.listAllDNS);
router.post('/cloudflare',ensureAuthenticated, cloudflareController.addDNS);
router.get('/delete_cloudflare',ensureAuthenticated, cloudflareController.deleteDNSHandle);

router.post('/update_cloudflare',ensureAuthenticated, cloudflareController.updateDNSHandle);

router.get('/update_cloudflare/:_id',ensureAuthenticated,async (req, res) => {
    const _id = req.params._id;
    if(!mongoose.Types.ObjectId.isValid(_id)) { 
        res.render('404');
    }
    const rs =await Cloudflare.findById({
        _id
    });
    let url = 'https://api.cloudflare.com/client/v4/zones/'+rs.ZoneID+'/dns_records';
    try {
        console.log('-------rs: ',rs);
        const datares = ( await axios.get(url, {
            headers: {
            'Content-Type': 'application/json',
            'Authorization' : rs.api_key,
            'X-Auth-Email': rs.email
            }
        }
        )).data; 
        // console.log('************edit_dns',datares);
        res.render('cloudflare/edit_dns',{
            data_record: datares.result,
            _id: rs._id,
            name: rs.name,
            email: rs.email,
            AccountID: rs.AccountID,
            ZoneID: rs.ZoneID,
            api_key: rs.api_key,
            description: rs.description,
            
            user: req.user, _active:"cloudflare"});
    }
    catch (error) {
        console.error(error);
        req.flash(
            'error_msg',
            'some thing failed'
        );
        res.redirect('/home/cloudflare');
        
      }    

});


router.get('/resources',ensureAuthenticated,async (req, res) => {
    console.log('------/home/resources');
    const rs = await Resources.find();
    res.render('d_resources',{user: req.user,rs,_active:"resources"});
});

router.post('/add_resource',ensureAuthenticated, resourceController.addResourcesHandle);


router.post('/update_resource',ensureAuthenticated, resourceController.updateResourcesHandle);

router.get('/update_resource/:_id',ensureAuthenticated, (req, res) => {
    const _id = req.params._id;
    if(!mongoose.Types.ObjectId.isValid(_id)) { 
        res.render('404');
    }
    Resources.findById({
        _id
    }).then(rs =>{
        res.render('apistatic/d_edit-apistatic',{ _id:rs._id,name:rs.name,res_id:rs.res_id,link:rs.link,description:rs.description, user: req.user,_active:"resources"});
    }).catch(err => {
        console.log(err);
        res.render('404');
    });;

});
router.get('/delete_resource',ensureAuthenticated, resourceController.deleteResourcesHandle);


router.get('/nginx',ensureAuthenticated, nginxController.getdeployNginx);
router.get('/nginx_reload',ensureAuthenticated, nginxController.reloadNginx);
router.post('/nginx_save',ensureAuthenticated, nginxController.rewriteNginx);
router.post('/nginx_getconfig',ensureAuthenticated, nginxController.viewOneconfig);
router.post('/nginx_deleteconfig',ensureAuthenticated, nginxController.deleteOneconfig);
router.post('/nginx_updateconfig',ensureAuthenticated, nginxController.updateOneconfig);
router.post('/nginx_addconfig',ensureAuthenticated, nginxController.addOneconfig);

router.get('/backup',ensureAuthenticated,(req, res) => {
    console.log('------/home/backup');
    res.render('d_backupDB',{user: req.user,_active:"backup"}); 
});

router.get('/', ensureAuthenticated, (req,res) => {
    res.render('dashboard',{user: req.user,_active:"home"});
});

module.exports = router;