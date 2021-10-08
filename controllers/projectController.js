const config = require('config');

const Project = require('../models/Project');
const Page = require('../models/Page');

exports.addProjectHandle = async (req, res) => {

    const { projectname, address, projectstatus,projectbody  } = req.body;

    const { tabname1, tabname1status, nav1  } = req.body;
    const { tabname2, tabname2status, nav2  } = req.body;
    const { tabname3, tabname3status, nav3  } = req.body;
    const { tabname4, tabname4status, nav4  } = req.body;

    console.log("DATA projectname:>" , projectname);
    console.log("DATA address:>" , address);
    console.log("DATA projectstatus:>" , projectstatus);
    console.log("DATA projectbody:>" , projectbody);

    let errors = [];
    //------------ Checking required fields ------------//
    if (!projectname || !address || !projectstatus  || !projectbody ) {
        errors.push({ msg: 'Please enter all required fields' });
    }
    if (errors.length > 0) {
        res.render('d_project', { 
            projectname, address,projectstatus,projectbody,
            tabname1, tabname1status, nav1,
            tabname2, tabname2status, nav2,
            tabname3, tabname3status, nav3,
            tabname4, tabname4status, nav4,
            errors,user: req.user, _active: 'project'
        });
    } else {
        await Project.findOne({ address: address }).then(project => {
            if (project) {
                res.render('d_project', { 
                    projectname, address,projectstatus,projectbody,
                    tabname1, tabname1status, nav1,
                    tabname2, tabname2status, nav2,
                    tabname3, tabname3status, nav3,
                    tabname4, tabname4status, nav4,
                    errors,user: req.user, _active: 'project'
                });
            }
            else {
                let newProject = new Project({
                    projectname,address,projectstatus,projectbody
                });
                let pages = [];
                if(tabname1 && tabname1status) {
                    const newPage1 = new Page({
                        page_name :tabname1,
                        page_address:address+".1",
                        page_status:tabname1status,
                        page_body:nav1
                    });
                    pages.push(newPage1);
                }
                
                if(tabname2 && tabname2status) {
                    const newPage2 = new Page({
                        page_name :tabname2,
                        page_address:address+".2",
                        page_status:tabname2status,
                        page_body:nav2
                    });
                    pages.push(newPage2);
                }
                if(tabname3 && tabname3status) {
                    const newPage3 = new Page({
                        page_name :tabname3,
                        page_address:address+".3",
                        page_status:tabname3status,
                        page_body:nav3
                    });
                    pages.push(newPage3);
                }
                if(tabname4 && tabname4status) {
                    const newPage4 = new Page({
                        page_name :tabname4,
                        page_address:address+".4",
                        page_status:tabname4status,
                        page_body:nav4
                    });
                    pages.push(newPage4);
                }

                Page.insertMany(pages).then(function(data){
                    console.log("Data inserted", data)  // Success
                    let pageIds = data.map(x => x._id);
                    newProject.pages.push(...pageIds);
                    newProject.save().then(project => {
                        console.log("SAve newProject",newProject);
    
                        console.log("NNNNnewProject",project);
                        
                        if(project) {
                            req.flash(
                                'success_msg',
                                'Submit success.'
                            );
                            res.redirect('/home/project');
                        }
                    });
                }).catch(function(error){
                    console.log(error)      // Failure
                });
                
                
            }
        });
    }


}
