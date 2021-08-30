const config = require('config');

//------------ User Model ------------//
const Link = require('../models/Link');

exports.addLinkHandle = (req, res) => {
    const { linkname, linkstatic,header,area,footer  } = req.body;
    let errors = [];
    //------------ Checking required fields ------------//
    if (!area ||!linkstatic ) {
        errors.push({ msg: 'Please enter body fields' });
    }
    if (errors.length > 0) {
        res.render('d_add-link', {
            errors,linkname, linkstatic,header,area,footer
        });
    } else {
        Link.findOne({ linkstatic:linkstatic }).then(link => { 
            if(link) {
                 //------------ User already exists ------------//
                 errors.push({ msg: 'Static link already!!!' });
                 res.render('d_add-link', {
                     errors,
                     linkname,
                     linkstatic,
                     header,
                     area,
                     footer
                 });
            }
            else {
                
                const newLink = new Link({
                    linkname,
                    linkstatic,
                    header,
                    area,
                    footer
                    });
                newLink.save().then(staticlink => {
                    req.flash(
                        'success_msg',
                        'Submit success.'
                    );
                    res.redirect('/home/document');
                })
                .catch(err => console.log(err));
            }
        });
        
    }


}

exports.deleteLinkHandle = async(req, res) => {
    const { linkname, linkstatic,id  } = req.body;
    let errors = [];
    console.log('linkname',linkname);

    console.log('linkstatic',linkstatic);
    console.log('linkstatic id ',id);
    //------------ Checking required fields ------------//
    if (!id  ) {
        errors.push({ msg: 'Something failed' });
    }
    if (errors.length > 0) {
        res.render('d_edit-link', {
            errors
        });
    } else {
        const link = await Link.findByIdAndDelete({_id :id});
        req.flash("success_msg", "Your link has been deleted.");
        res.redirect("/home/document");
    }


}
exports.updateLinkHandle = (req, res) => {
    const { linkname, linkstatic,header,area,footer ,id } = req.body;
    let errors = [];
    //------------ Checking required fields ------------//
    if (!area ||!linkstatic ||!id ) {
        errors.push({ msg: 'Please enter body fields' });
    }
    if (errors.length > 0) {
        res.render('d_edit-link', {
            errors,linkname, linkstatic,header,area,footer,_id:id
        });
    } else {
        Link.findOne({ _id:id }).then(link => { 
            if(!link) {
                 //------------ User already exists ------------//
                 errors.push({ msg: 'Has something wrong!!!' });
                 res.render('d_edit-link', {
                     errors,
                     linkname,
                     linkstatic,
                     header,
                     area,
                     footer,
                     _id:id
                 });
            }
            else {
                
                link.area = area;
                link.linkname =linkname;
                link.header= header;
                link.footer = footer;
                link.save();
                req.flash(
                    'success_msg',
                    'Update success '+linkname
                );
                res.redirect("/home/document");
            }
        });
        
    }


}