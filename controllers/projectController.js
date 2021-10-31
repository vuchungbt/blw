const config = require('config');
const mongoose = require('mongoose');

const Project = require('../models/Project');
const Page = require('../models/Page');

const fs = require("fs");
const  {exec } = require("child_process");
exports.getdeployProjectHandle = async (req,res) => {

    const address = req.body.address;
    let filepath = config.get("nginxdir") + '/' + address + '.conf';

    fs.readFile(filepath, function(err, buf) {
        if(err)  {
            console.log( 'file not exist',err);
            data = 'server {' +
            '\t\nlisten       80;' +
            '\t\nserver_name  ' + address +'.'+ req.headers.host+';' +
            '\t\nlocation / {' +
            '\t\t\nproxy_set_header Host $host;' +
            '\t\t\nproxy_set_header X-Real-IP $remote_addr;' +
            '\t\t\nproxy_pass      '+'http://localhost:3000'+'/projectpage/' + address + ';' +
            '\t\n}' +
            '\n}'
            return res.status(200).json({
                status: 200,
                data: data,
                msg:'Get data in file'
            });
        }
        var data ='Error';
        if(buf.toString()!=null && buf.toString()!=undefined && buf.toString()){
            data = buf.toString();
        } else {
             data = 'server {' +
            '\t\nlisten       80;' +
            '\t\nserver_name  ' + address + req.headers.host+';' +
            '\t\nlocation / {' +
            '\t\t\nproxy_set_header Host $host;' +
            '\t\t\nproxy_set_header X-Real-IP $remote_addr;' +
            '\t\t\nproxy_pass      '+'http://localhost:3000'+'/projectpage/' + address + ';' +
            '\t\n}' +
            '\n}'
    
            console.log('DATA NGINX', data);
    
        }
        return res.status(200).json({
            status: 200,
            data: data,
            msg:'Get data in file'
        });
      });

}
exports.deployProjectHandle = async (req,res) => {
    const address = req.body.address;
    const contentnginx = req.body.contentnginx;
    
    let filepath = config.get("nginxdir") + '/' + address + '.conf';
 
    console.log('DEtail address> :',address);

    fs.readFile(filepath, function(err, buf) {
        if(err)  {
            let msg ='';
            fs.writeFile(filepath, contentnginx, (err) => {
                if(err){
                    console.log('Write file error',err);
                    msg = 'Write file error.';
                    req.flash(
                        'error_msg',
                        msg
                    );
                    res.redirect('/home/project');
                } 
                else {
                    console.log("Successfully Written to File.");
                    msg = 'Successfully Written conf to File.';
                    exec("sudo service nginx reload", (error, stdout, stderr) => {
                        if (error) {
                            console.log(`error: ${error.message}`);
                            msg = 'Error restarted.' ;
                        }
                        if (stderr) {
                            console.log(`stderr: ${stderr}`);
                        }
                        console.log(`stdout: ${stdout}`);

                        let url = 'https://api.cloudflare.com/client/v4/zones/'+config.get('DNSzoneID')+'/dns_records';
                        let body = {
                            "type":"CNAME",
                            "name":address+".blwsmartware.net",
                            "content":"blwsmartware.net",
                            "ttl":1,
                            "proxied":true
                            }
                        const datares= axios.post(url, body, {
                            headers: {
                            'Content-Type': 'application/json',
                            'Authorization' : config.get('CLAPIKey')
                            }
                          }
                        ) ;
                        if (datares && datares.success==true) {
                            
                            req.flash(
                                'success_msg',
                                msg
                            );
                            res.redirect('/home/project');
                        }
                        else {
                            msg+= datares.errors.message ;
                            req.flash(
                                'error_msg',
                                msg
                            );
                            res.redirect('/home/project');
                        }
    
                        
                    });
    
                } 
                             
            });
        }
        else {
            fs.writeFile(filepath, contentnginx, (err) => {
                if(err){
                    console.log('Write file error',err);
                    msg = 'Write file error.';
                    req.flash(
                        'error_msg',
                        msg
                    );
                    res.redirect('/home/project');
                } 
                else {
                    console.log("Successfully Written to File.");
                    msg = 'Successfully Written to File.';
                    exec("sudo service nginx reload", (error, stdout, stderr) => {
                        if (error) {
                            console.log(`error: ${error.message}`);
                            msg = 'Error restarted' ;
                        }
                        if (stderr) {
                            console.log(`stderr: ${stderr}`);
                        }
                        console.log(`stdout: ${stdout}`);
    
                        req.flash(
                            'success_msg',
                            msg
                        );
                        res.redirect('/home/project');
                    });
    
                } 
                             
            });
    
        }
      });
}

exports.addProjectHandle = async (req, res) => {

    const { projectname, address, projectstatus, projectbody } = req.body;

    const { tabname1, tabname1status, nav1 } = req.body;
    const { tabname2, tabname2status, nav2 } = req.body;
    const { tabname3, tabname3status, nav3 } = req.body;
    const { tabname4, tabname4status, nav4 } = req.body;

    let errors = [];
    let msg='error!';
    let check = 0 ;
    //------------ Checking required fields ------------//
    if (!projectname || !address || !projectstatus ) {
        msg = 'Please enter all required fields';
        check = 1;
    }
    if (!tabname1 && tabname1status == 'Enable') {
        msg=  'Tabname can not null';
        check = 1;
    }
    if (!tabname2 && tabname2status == 'Enable') {
        msg=  'Tabname can not null';
        check = 1;
    }
    if (!tabname3 && tabname3status == 'Enable') {
        msg=  'Tabname can not null' ;
        check = 1;
    }
    if (!tabname4 && tabname4status == 'Enable') {
        msg=  'Tabname can not null';
        check = 1;
    }
    if (check == 1) {
        req.flash(
            'error_msg',
            msg
        );
        res.redirect('/home/project');
    } else {
        await Project.findOne({ address: address }).then(project => {
            if (project) {
                errors.push({ msg: 'Address exist' });
                req.flash(
                    'error_msg',
                    'Submit error.'
                );
                res.redirect('/home/project');
            }
            else {
                let createdByName = req.user.name;
                let createdBy = req.user._id;
                let newProject = new Project({
                    projectname, address, projectstatus, projectbody,createdByName,createdBy
                });
                let pages = [];

                const newPage1 = new Page({
                    page_name: tabname1,
                    page_address: address + ".1",
                    page_status: tabname1status,
                    page_body: nav1
                });
                pages.push(newPage1);



                const newPage2 = new Page({
                    page_name: tabname2,
                    page_address: address + ".2",
                    page_status: tabname2status,
                    page_body: nav2
                });
                pages.push(newPage2);


                const newPage3 = new Page({
                    page_name: tabname3,
                    page_address: address + ".3",
                    page_status: tabname3status,
                    page_body: nav3
                });
                pages.push(newPage3);


                const newPage4 = new Page({
                    page_name: tabname4,
                    page_address: address + ".4",
                    page_status: tabname4status,
                    page_body: nav4
                });
                pages.push(newPage4);


                Page.insertMany(pages).then(function (data) {
                    console.log("Data Page inserted")  // Success
                    let pageIds = data.map(x => x._id);
                    newProject.pages.push(...pageIds);
                    newProject.save().then(project => {
                        if (project) {
                            console.log("Data Project inserted")  // Success
                            req.flash(
                                'success_msg',
                                'Submit success.'
                            );
                            res.redirect('/home/project');
                        }
                    });
                }).catch(function (error) {
                    console.log(error)      // Failure
                    res.render('404');
                });


            }
        });
    }


}
exports.updateProjectHandle = async (req, res) => {

    const { projectid,projectname, projectstatus, projectbody } = req.body;

    const { tabname1, tabname1status, nav1, pageid1 } = req.body;
    const { tabname2, tabname2status, nav2, pageid2} = req.body;
    const { tabname3, tabname3status, nav3, pageid3} = req.body;
    const { tabname4, tabname4status, nav4, pageid4} = req.body;

    

    let errors = [];
    let msg='error!';
    let check = 0 ;
    //------------ Checking required fields ------------//
    if (!projectname || !projectstatus ) {
        msg = 'Please enter all required fields';
        check = 1;
    }
    if (!tabname1 && tabname1status == 'Enable') {
        msg=  'Tabname can not null';
        check = 1;
    }
    if (!tabname2 && tabname2status == 'Enable') {
        msg=  'Tabname can not null';
        check = 1;
    }
    if (!tabname3 && tabname3status == 'Enable') {
        msg=  'Tabname can not null' ;
        check = 1;
    }
    if (!tabname4 && tabname4status == 'Enable') {
        msg=  'Tabname can not null';
        check = 1;
    }
    if (check == 1) {
        req.flash(
            'error_msg',
            msg
        );
        res.redirect('/home/project');
    } else {
        const project = await Project.findByIdAndUpdate(projectid, {projectname, projectstatus, projectbody});
        const address = project.address;
        if (!project) {
            req.flash(
                'error_msg',
                'Not found Project'
            );
            res.redirect('/home/project');
        }
        else 
        {
            console.log('save sucess Project', project); 
            let pages = [];
            pages.push({
                _id: pageid1,
                page_name: tabname1,
                page_address: address + ".1",
                page_status: tabname1status,
                page_body: nav1
            });

            pages.push({
                _id: pageid2,
                page_name: tabname2,
                page_address: address + ".2",
                page_status: tabname2status,
                page_body: nav2
            });

            pages.push({
                _id: pageid3,
                page_name: tabname3,
                page_address: address + ".3",
                page_status: tabname3status,
                page_body: nav3
            });

            pages.push({
                _id: pageid4,
                page_name: tabname4,
                page_address: address + ".4",
                page_status: tabname4status,
                page_body: nav4
            });

            console.log('Pages', pages);
            let pageIds = pages.map(x => x._id);

            // Page.updateMany({ "_id": { "$in": ids }}, { "$set": { "Supplier": "S" }});

            pages.forEach(async page => {
               await Page.findByIdAndUpdate(page._id, page);
            });

            console.log('Update pages ok');
            // Page.updateMany(pages).then(function (data) {
            //     console.log("Data inserted")  // Success
                
            //     newProject.pages.push(...pageIds);
            //     newProject.save().then(project => {
            //         if (project) {
            //             req.flash(
            //                 'success_msg',
            //                 'Submit success.'
            //             );
            //             res.redirect('/home/project');
            //         }
            //     });
            // }).catch(function (error) {
            //     console.log(error)      // Failure
            //     res.render('404');
            // });
            req.flash(
                'success_msg',
                'Submit success.'
            );
            res.redirect('/home/project');
        }
    }


}
exports.deleteProjectHandle = async (req, res) => {
    const { id } = req.body;
    let errors = [];
    console.log('Delete project id ', id);
    //------------ Checking required fields ------------//
    if (!id) {
        errors.push({ msg: 'Something failed' });
    }
    if(!mongoose.Types.ObjectId.isValid(id)) {  
        errors.push({ msg: 'Something failed' });
    }
    if (errors.length > 0) {
        res.render('project/d_edit-project', {
            errors, user: req.user, _active: 'project'
        });
    } else {
        const pj = await Project.findByIdAndDelete({ _id: id });

        let filepath = config.get("nginxdir") + '/' + pj.address + '.conf';

        fs.unlink(filepath, function(err) {
            let msg = "Your project has been deleted.";
            if(err && err.code == 'ENOENT') {
                msg+= "File conf doesn't exist";
                console.log("File doesn't exist, won't remove it.",pr.address);
            } else if (err) {
                msg+=  "Remove conf error";
                console.log("Error occurred while trying to remove file",pr.address);
            } else {
                console.log('removed file conf',pr.address);
            }
            req.flash("success_msg", msg);
            res.redirect("/home/project");
        });
        

        
    }
}
