const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const  Link  = require('../models/Link');
const  Project  = require('../models/Project');
const  Page  = require('../models/Page');
const  Resources  = require('../models/Resources');


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
//------------ static link ------------//
router.get('/static/:_link', async(req, res) => {

    const _link = req.params._link;
    console.log("LINK:", _link);
    try {
        const link = await Link.findOne({ linkstatic: _link });
      
        if (link.status!=='Disable') {
            res.render('document/staticlink', {link:link});
        }
        else {
            res.render('404');
        }
    } catch (error) {
        console.log(error);
    }
});
router.get('/projectpage', async(req, res) => { 
   
    const _link = req.params._link;
    const _page = req.query.page;
    const _host = 'https://'+ req.headers.host;
    
    console.log("_page ADDRESS:", _page);
    console.log("_link ADDRESS:", _link);

    if(_page && _page !==null && _page!== undefined) {
        Page.findOne({ page_address: _page }).then(page =>{
            
            if(page && page.page_status!=='Disable') {
                page.parentname = 'Home';
                page.host = _host;
                res.render('project/viewpage',{page:page});
            }
            else {
                console.log('Not found Page with page:',_page); 
                res.render('404');
            }
                
        }).catch(err => {
            console.log(err);
            res.render('404');
        });
    }
    else
        res.render('404');
}) 
//------------ static project ------------//
router.get('/projectpage/:_link', async(req, res) => {
    
    const _link = req.params._link;
    const _page = req.query.page;
    const _host = req.headers.host;
    
    console.log("PAGE ADDRESS:", _page);
    if(_page!==null && _page !==undefined && _page.length>0) {

       const pr = await  Project.findOne({ address: _link });

        Page.findOne({ page_address: _page }).then(page =>{
            console.log("PAge >>",page);
            if(page && page.page_status!=='Disable') {
                page.parentlink = 'http://'+_host;
                page.parent = pr.address;
                page.parentname = pr.projectname;
                res.render('project/viewpage',{page:page});
            }
            else {
                console.log('Not found Page with page:',_page); 
                res.render('404');
            }
                
        }).catch(err => {
            console.log(err);
            res.render('404');
        });

    }
    else {
        console.log("PROJECT ADDRESS:", _link);
        Project.findOne({ address: _link }).then(project =>{
            Page.find({
                '_id': { 
                    $in: project.pages.map(p => mongoose.Types.ObjectId(p))
                },'page_status':'Enable'
            }).then(pages => {
                project.pagelist = pages;
                if(project.projectstatus!=='Disable') {
                    project.parentlink = 'http://'+ _host;
                    res.render('project/viewproject',{project:project});
                }
                else 
                    res.render('404');
            });
    
        }).catch(err => {
            console.log(err);
            res.render('404');
        });;
    }
    
    


});
router.get('/pagemenu/:_link', async(req, res) => {

    const _link = req.params._link;
    console.log("PAGE ADDRESS:", _link);

    Page.findOne({ page_address: _link }).then(page =>{
        
            if(page.page_status!=='Disable') {
                page.host = 'https://'+ req.headers.host;
                res.render('project/viewpage',{page:page});
            }
            else 
                res.render('404');
    }).catch(err => {
        console.log(err);
        res.render('404');
    });;
});
router.get('/file/:_link', async(req, res) => {

    const _link = req.params._link;

    const fs = require('fs')

    const path = './uploads/'+_link;
    const path2 = './"uploadsFile"/'+_link;
    try {
        if (fs.existsSync(path)) {
            const fileSizeKb = fs.statSync(path).size/1024;
            const fileSizeMb = (fileSizeKb/1024).toFixed(4);
            res.render('d_filedownload',{file_name:_link,size:fileSizeMb,ori_size:fileSizeKb, link:'https://'+req.headers.host+'/'+_link});
        } else if (fs.existsSync(path2)) {
            const fileSizeKb = fs.statSync(path2).size/1024;
            const fileSizeMb = (fileSizeKb/1024).toFixed(4);
            res.render('d_filedownload',{file_name:_link,size:fileSizeMb,ori_size:fileSizeKb, link:'https://'+req.headers.host+'/'+_link});
        }
        else {
            console.error('file download not exist' );
            res.render('404');
        }
    } catch(err) {
        console.error('file download not exist' ,err );
        res.render('404');

    }
    


});
router.get('/api/resources',async (req, res) => {
    try {
        const rs = await Resources.find();
        if (rs.length != 0) {
            return res.status(200).json({
                status: 200,
                result:rs
            });
        } else {
            return res.status(404).json({
                status: 404,
                msg: 'Not Found'
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            status: 400,
            msg: 'Link find failed'
        });
    }

});


module.exports = router;