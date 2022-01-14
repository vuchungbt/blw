const fs = require("fs");
const  {exec } = require("child_process");

exports.getdeployNginx = async (req,res) => { 
    let filepath = '/etc/nginx/nginx.conf';
    console.log('filepath ***',filepath);
    fs.readFile(filepath,  (err, buf) => {
        console.log('fs.readFile *4**',filepath);
        console.log('data *4**',buf);
        if(err)  {
            console.log('err *5**',err);
            req.flash(
                'error_msg',
                'can not read nginx.conf.'
              );
              res.render('d_nginx',{ 'error':'can not read nginx.conf', user: req.user,_active:"nginx"}); 
        }
        var data ='Error';
        if(buf.toString()!=null && buf.toString()!=undefined && buf.toString()){
            
            data = buf.toString();
            console.log('success *5**',data);
            fs.readdir('/etc/nginx/sites-available', function (err, files) {
                console.log('fs.readdir *8**');
                if (err) {
                    req.flash(
                        'error_msg',
                        'can not read folder config.'
                      );
                      res.render('d_nginx',{ 'error':'can not read folder config', user: req.user,_active:"nginx"}); 
                } 
                
                res.render('d_nginx',{ nginx_data: data, nginx_config:files, user: req.user,_active:"nginx"}); 
            });
        } else {
            req.flash(
                'error_msg',
                'content empty.'
              );
              res.render('d_nginx',{ 'error':'content empty', user: req.user,_active:"nginx"}); 
    
        }
      });
    

}