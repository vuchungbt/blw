const  Resources  = require('../models/Resources');

exports.addResourcesHandle = (req, res) => {
    const { name, link, res_id, description} = req.body;
    let errors = [];

     //------------ Checking required fields ------------//
    if (!name || !link) {
        req.flash(
            'error_msg',
            'Please enter mandatory fields.'
        );
        res.redirect('/home/resources');
    }

    //------------ Validation passed ------------//
    Resources.findOne({ name }).then(rs => {
        if (rs) {
            //------------ User already exists ------------//
            req.flash(
                'error_msg',
                'name already registered.'
            );
            res.redirect('/home/resources');
        } else {

            const rs = new Resources({
                name, link, res_id, description
            });
            rs.save();
            req.flash(
                'success_msg',
                'Link have been added.'
            );
            res.redirect('/home/resources');


        }
    });
}

exports.updateResourcesHandle = (req, res) => {
    const { id, name, link, res_id, description} = req.body;
 
     //------------ Checking required fields ------------//
     if (!name || !link) {
        req.flash(
            'error_msg',
            'Please enter mandatory fields.'
        );
        res.redirect('/home/resources');
    }
        //------------ Validation passed ------------//
        User.findOne({ _id: id }).then(newLink => {

            newLink.name = name;
            newLink.link = link;
            newLink.res_id = res_id;
            newLink.description = description;

            newLink.save()
                        .then(user => {
                            req.flash(
                                'success_msg',
                                'Link have been updated.'
                            );
                            res.redirect('/home/resources');
                        })
                        .catch(err => console.log(err));

        });

    
}