const config = require('config');
const mongoose = require('mongoose');

const Project = require('../models/Project');
const Page = require('../models/Page');

exports.addProjectHandle = async (req, res) => {

    const { projectname, address, projectstatus, projectbody } = req.body;

    const { tabname1, tabname1status, nav1 } = req.body;
    const { tabname2, tabname2status, nav2 } = req.body;
    const { tabname3, tabname3status, nav3 } = req.body;
    const { tabname4, tabname4status, nav4 } = req.body;

    let errors = [];
    //------------ Checking required fields ------------//
    if (!projectname || !address || !projectstatus || !projectbody) {
        errors.push({ msg: 'Please enter all required fields' });
    }
    if (!tabname1 && tabname1status == 'Enable') {
        errors.push({ msg: 'Tabname can not null' });
    }
    if (!tabname2 && tabname2status == 'Enable') {
        errors.push({ msg: 'Tabname can not null' });
    }
    if (!tabname3 && tabname3status == 'Enable') {
        errors.push({ msg: 'Tabname can not null' });
    }
    if (!tabname4 && tabname4status == 'Enable') {
        errors.push({ msg: 'Tabname can not null' });
    }
    if (errors.length > 0) {
        res.render('d_project', {
            projectname, address, projectstatus, projectbody,
            tabname1, tabname1status, nav1,
            tabname2, tabname2status, nav2,
            tabname3, tabname3status, nav3,
            tabname4, tabname4status, nav4,
            errors, user: req.user, _active: 'project'
        });
    } else {
        await Project.findOne({ address: address }).then(project => {
            if (project) {
                errors.push({ msg: 'Address exist' });
                res.render('d_project', {
                    projectname, address, projectstatus, projectbody,
                    tabname1, tabname1status, nav1,
                    tabname2, tabname2status, nav2,
                    tabname3, tabname3status, nav3,
                    tabname4, tabname4status, nav4,
                    errors, user: req.user, _active: 'project'
                });
            }
            else {
                let newProject = new Project({
                    projectname, address, projectstatus, projectbody
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
                    console.log("Data inserted")  // Success
                    let pageIds = data.map(x => x._id);
                    newProject.pages.push(...pageIds);
                    newProject.save().then(project => {
                        if (project) {
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

    const { projectid,projectname, address, projectstatus, projectbody } = req.body;

    const { tabname1, tabname1status, nav1 } = req.body;
    const { tabname2, tabname2status, nav2 } = req.body;
    const { tabname3, tabname3status, nav3 } = req.body;
    const { tabname4, tabname4status, nav4 } = req.body;

    

    let errors = [];
    //------------ Checking required fields ------------//
    if (!projectname || !address || !projectstatus || !projectbody) {
        errors.push({ msg: 'Please enter all required fields' });
    }
    if (!tabname1 && tabname1status == 'Enable') {
        errors.push({ msg: 'Tabname can not null' });
    }
    if (!tabname2 && tabname2status == 'Enable') {
        errors.push({ msg: 'Tabname can not null' });
    }
    if (!tabname3 && tabname3status == 'Enable') {
        errors.push({ msg: 'Tabname can not null' });
    }
    if (!tabname4 && tabname4status == 'Enable') {
        errors.push({ msg: 'Tabname can not null' });
    }
    if (errors.length > 0) {
        res.render('d_project', {
            projectname, address, projectstatus, projectbody,
            tabname1, tabname1status, nav1,
            tabname2, tabname2status, nav2,
            tabname3, tabname3status, nav3,
            tabname4, tabname4status, nav4,
            errors, user: req.user, _active: 'project'
        });
    } else {
        await Project.findOne({ address: address }).then(project => {
            if (project) {
                errors.push({ msg: 'Address exist' });
                res.render('d_project', {
                    projectname, address, projectstatus, projectbody,
                    tabname1, tabname1status, nav1,
                    tabname2, tabname2status, nav2,
                    tabname3, tabname3status, nav3,
                    tabname4, tabname4status, nav4,
                    errors, user: req.user, _active: 'project'
                });
            }
            else {
                let newProject = new Project({
                    projectname, address, projectstatus, projectbody
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
                    console.log("Data inserted")  // Success
                    let pageIds = data.map(x => x._id);
                    newProject.pages.push(...pageIds);
                    newProject.save().then(project => {
                        if (project) {
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
        req.flash("success_msg", "Your project has been deleted.");
        res.redirect("/home/project");
    }
}
