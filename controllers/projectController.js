const config = require('config');

//------------ User Model ------------//
const Project = require('../models/Project');

exports.addProjectHandle = (req, res) => {
    const { projectname, projectactive,projectdescription  } = req.body;
    let errors = [];
    //------------ Checking required fields ------------//
    if (!projectname || !projectactive ) {
        errors.push({ msg: 'Please enter all fields' });
    }
    if (errors.length > 0) {
        res.render('d_project', {
            errors
        });
    } else {
        const newProject = new Project({
            projectname,
            projectactive,
            projectdescription
            });
            newProject.save().then(proj => {
                req.flash(
                    'success_msg',
                    'Submit success.'
                );
                res.redirect('/home/project');
            })
            .catch(err => console.log(err));
    }


}
