const express = require('express');
const router = express.Router();

const fs = require("fs");

const { uploadImage,uploadFile } = require('../middleware/uploadFile');

//------------ file ------------//
router.get('/file', (req, res) => {
    fs.readdir('./uploads', function (err, files) {
        //handling error
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        } 
        files.host ='http://blwsmartware.net';
        res.render('d_file_guest',{files:files,_active:'file'});
    });
    
});
//------------ upload image ------------//
router.get('/', (req, res) => {
    res.render('updownload/upload_image');
});
//------------ upload file ------------//
router.get('/viewupload', (req, res) => {
    res.render('updownload/upload_file');
    
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

module.exports = router;