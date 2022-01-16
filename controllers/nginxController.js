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
exports.reloadNginx = async (req,res) => { 
    exec("sudo service nginx reload", async (error, stdout, stderr) => {
        let msg = "Reload Nginx success!"
        if (error) {
            console.log(`error: ${error.message}`);
            msg = 'Error restarted.' ;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
        }
        console.log(`stdout: ${stdout}`);
        req.flash(
            'success_msg',
            msg
        );
        res.redirect('/home/nginx');
    });
}

exports.rewriteNginx = async (req,res) => { 

    let filepath = '/etc/nginx/nginx.conf';
    let backupfolder = '/etc/nginx/bkconf';
    

    const contentnginx = req.body.contentnginx;
    exec('cp '+filepath+' '+backupfolder+'/nginx_'+Date.now()+".bk", async (error, stdout, stderr) => {
        let msg = "Backup file Nginx success!"
        if (error) {
            console.log(`error: ${error.message}`);
            msg = 'Error Backup' ;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
        }
        console.log(`stdout: ${stdout}`);
    });

    fs.writeFile(filepath, contentnginx, (err) => {
        if(err){
            console.log('Write file error',err);
            msg = 'Write file error.';
            req.flash(
                'error_msg',
                msg
            );
            res.redirect('/home/nginx');
        } 
        req.flash(
            'error_msg',
            'Save content Nginx success'
        );
        res.redirect('/home/nginx');
    });
}