const config = require("config");
const mongoose = require('mongoose');
//------------ User Model ------------//
const User = require('../models/User');

//------------ Register Handle ------------//
exports.addMemberHandle = (req, res) => {
    const { name, phone, permission, active, email, password} = req.body;
    let errors = [];

    //------------ Checking required fields ------------//
    if (!name || !phone || !email || !permission || !active || !password ) {
        errors.push({ msg: 'Please enter all fields' });
    }

    //------------ Checking password length ------------//
    if (password.length < 6) {
        errors.push({ msg: 'Password must be at least 6 characters' });
    }
    //------------ Checking password length ------------//

    if (errors.length > 0) {
        res.render('register', {
            errors,
            name,
            phone,
            email,
            permission,
            active,
            password
        });
    } else {
        //------------ Validation passed ------------//
        User.findOne({ email: email }).then(user => {
            if (user) {
                //------------ User already exists ------------//
                errors.push({ msg: 'Email ID already registered' });
                res.render('register', {
                    errors,
                    name,
                    phone,
                    email,
                    permission,
                    active,
                    password
                });
            } else {
                User.findOne({ email: email }).then(user => {
                    if (user) {
                        //------------ User already exists ------------//
                        req.flash(
                            'error_msg',
                            'Email ID already registered! Please log in.'
                        );
                        res.redirect('/home/member');
                    } else {
                        const newUser = new User({
                            name,
                            phone,
                            permission,
                            active,
                            email,
                            password
                        });

                        bcryptjs.genSalt(10, (err, salt) => {
                            bcryptjs.hash(newUser.password, salt, (err, hash) => {
                                if (err) throw err;
                                newUser.password = hash;
                                newUser
                                    .save()
                                    .then(user => {
                                        req.flash(
                                            'success_msg',
                                            'Account have been added.'
                                        );
                                        res.redirect('/home/member');
                                    })
                                    .catch(err => console.log(err));
                            });
                        });
                    }
                });

            }
        });
    }
}
exports.deleteLinkHandle =  (req, res) => {
    const { id } = req.body;
    let errors = [];
    console.log('Delete user ', id);
    //------------ Checking required fields ------------//
    if (!id) {
        errors.push({ msg: 'Something failed' });
    }
    if(!mongoose.Types.ObjectId.isValid(id)) {  
        errors.push({ msg: 'Something failed' });
    }
    if (errors.length > 0) {
        res.render('document/member', {
            errors, user: req.user, active: 'member'
        });
    } else {
        User.findByIdAndDelete({ _id: id });
        req.flash("success_msg", "Account has been deleted.");
        res.redirect("/home/member");
    }
}
