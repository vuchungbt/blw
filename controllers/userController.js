const config = require("config");
const bcryptjs = require('bcryptjs');
const mongoose = require('mongoose');
//------------ User Model ------------//
const User = require('../models/User');

//------------ Register Handle ------------//
exports.addMemberHandle = (req, res) => {
    let { name, phone, permission, active, email, password } = req.body;
    let errors = [];
    permission='Admin';

    //------------ Checking permission fields ------------//
    if (req.user.permission == 'Member' && permission != 'Member') {
        req.flash(
            'error_msg',
            'Can not create account.'
        );
        res.redirect('/home/member');
    }
    
    // if (req.user.permission == 'Owner' && permission == 'Admin') {
    //     req.flash(
    //         'error_msg',
    //         'Can not create account.'
    //     );
    //     res.redirect('/home/member');
    // }

    //------------ Checking required fields ------------//
    if (!name || !phone || !email || !permission || !active || !password) {
        req.flash(
            'error_msg',
            'Please enter all fields.'
        );
        res.redirect('/home/member');
    }

    //------------ Checking password length ------------//
    if (password.length < 6) {
        req.flash(
            'error_msg',
            'Password must be at least 6 characters.'
        );
        res.redirect('/home/member');
    }
    //------------ Checking password length ------------//


    //------------ Validation passed ------------//
    User.findOne({ email: email }).then(user => {
        if (user) {
            //------------ User already exists ------------//
            req.flash(
                'error_msg',
                'Email ID already registered.'
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
exports.deleteMemberHandle = async (req, res) => {
    const { id } = req.body;

    console.log('Delete user ', id);
    console.log("Permision:", req.user.permission);

    if (req.user.permission == 'Member' || req.user.permission == 'Owner') {
        req.flash(
            'error_msg',
            'Something failed. Access denied.'
        );
        res.redirect('/home/member');
    }

    //------------ Checking required fields ------------//
    if (req.user._id == id) {
        req.flash(
            'error_msg',
            'Something failed. Access denied.'
        );
        res.redirect('/home/member');
    }
    if (!id) {
        req.flash(
            'error_msg',
            'Something failed. Access denied.'
        );
        res.redirect('/home/member');
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
        req.flash(
            'error_msg',
            'Something failed. Access denied.'
        );
        res.redirect('/home/member');
    }

    const user = await User.findByIdAndDelete({ _id: id });
    req.flash("success_msg", "Account has been deleted.");
    res.redirect("/home/member");

}
exports.updateMemberHandle = (req, res) => {
    let { name, phone, permission, active, email, password, id } = req.body;
 
    let errors = [];

    //------------ Checking permission fields ------------//
    if (req.user.permission == 'Member') {
        errors.push({ msg: 'Can not update account' });
    }

    //------------ Checking required fields ------------//
    if (!name || !phone || !email || !permission || !active, !id) {
        errors.push({ msg: 'Please enter all fields' });
    }

    //------------ Checking password length ------------//
    if (password.length > 0 && password.length < 6) {
        errors.push({ msg: 'Password must be at least 6 characters' });
    }
    //------------ Validation passed ------------//
    User.findOne({ email: email }).then(user => {
        if (user) {
            errors.push({ msg: 'Email ID already registered' });
        }
    });

    if (errors.length > 0) {
        res.render('member/d_edit-user', {
            errors,
            name,
            phone,
            email,
            permission,
            active,
            id, user: req.user, _active: 'member'
        });
    } else {
        //------------ Validation passed ------------//
        User.findOne({ _id: id }).then(newUser => {

            newUser.name = name;
            newUser.phone = phone;
            if (req.user.permission == 'Admin') { newUser.permission = permission; }
            newUser.active = active;
            newUser.email = email;

            bcryptjs.genSalt(10, (err, salt) => {
                bcryptjs.hash(password, salt, (err, hash) => {
                    if (err) throw err;
                    if (password) newUser.password = hash;

                    newUser
                        .save()
                        .then(user => {
                            req.flash(
                                'success_msg',
                                'Account have been updated.'
                            );
                            res.redirect('/home/member');
                        })
                        .catch(err => console.log(err));
                });
            });

        });

    }
}
// for ajax request
exports.updateMyprofileHandle = (req, res) => {
    console.log('body', req.body);
    const { name, phone } = req.body;

    //------------ Checking required fields ------------//
    if (!name || !phone) {
        res.status(401).json({
            status: 401,
            msg: 'Name and phone number not empty!',
        });
    }

    //------------ Validation passed ------------//
    User.findOne({ _id: req.user.id }).then(newUser => {

        newUser.name = name;
        newUser.phone = phone;

        newUser.save().then(user => {
            res.json({
                status: 200,
                user,
                msg:'update success!'
            });
        })
            .catch(err => console.log(err));

    });
}
// for ajax request
exports.updatePassprofileHandle = (req, res) => {
    console.log('body', req.body);
    const { passwordold,password, password2 } = req.body;


    //------------ Checking required fields ------------//
    if (!password || !password2 || !passwordold) {
        return res.status(401).json({
            status: 401,
            msg: 'Password not empty!',
        });
    }
     //------------ Checking required fields ------------//
     if (password !=password2) {
        return  res.status(401).json({
            status: 401,
            msg: 'Retype password not correct!',
        });
    }
    //------------ Checking required fields ------------//
    if (password.length <6) {
        return res.status(401).json({
            status: 401,
            msg: 'Password must be at least 6 characters!',
        });
    }
    //----------- check old password ----------------//
    User.findOne({ _id: req.user.id  }).then(newUser => {
        console.log('compare',req.body.passwordold);
        bcryptjs.compare(req.body.passwordold, newUser.password, function(err, results){
            if(err){
                if (err)  {
                    return res.status(401).json({
                        msg:'Error!'
                    });
                };
             }
             if (results) {
                bcryptjs.genSalt(10, (err, salt) => {
                    bcryptjs.hash(password, salt, (err, hash) => {
                        if (err)  {
                            return res.status(401).json({
                                msg:'Error!'
                            });
                        };
                        if (password) newUser.password = hash;
                        console.log('compare before');
                        newUser
                            .save()
                            .then(user => {
                                res.status(200).json({
                                    status: 200,
                                    user,
                                    msg:'update success!'
                                });
                            })
                            .catch(err => console.log(err));
                    });
                });
            } else {
                res.status(401).json({
                    status: 401,
                    msg: 'Old password not correct!',
                });
            }
           })

    });

}
