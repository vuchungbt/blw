const fs = require("fs");
const  {exec } = require("child_process");

exports.getdeployNginx = async (req,res) => { 
    let filepath = '/etc/nginx/nginx.conf';
    fs.readFile(filepath, function(err, buf) {
        if(err)  {
            req.flash(
                'error_msg',
                'can not read nginx.conf.'
              );
              res.redirect('/home/nginx');
        }
        var data ='Error';
        if(buf.toString()!=null && buf.toString()!=undefined && buf.toString()){
            data = buf.toString();
            fs.readdir('/etc/nginx/sites-available', function (err, files) {
                //handling error
                if (err) {
                    req.flash(
                        'error_msg',
                        'can not read folder config.'
                      );
                      res.redirect('/home/nginx');
                } 
                
                res.render('d_nginx',{ nginx_data: data, nginx_config:files, user: req.user,_active:"nginx"}); 
            });
        } else {
            req.flash(
                'error_msg',
                'content empty.'
              );
            res.redirect('/home/nginx');
    
        }
      });
    

}