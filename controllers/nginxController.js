const fs = require("fs");
const  {exec } = require("child_process");
const config = require('config');

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
        console.log(`Backup file>>: ${backupfolder}`);
        if (error) {
            console.log(`Backup error: ${error.message}`);
            msg = 'Error Backup' ;
        }
        if (stderr) {
            console.log(`Backup stderr: ${stderr}`);
        }
        console.log(`Backup stdout: ${stdout}`);
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
            'success_msg',
            'Save content Nginx success, next step to Reload for change'
        );
        res.redirect('/home/nginx');
    });
}

exports.viewOneconfig = async (req,res) => { 
    const address = req.body.name;
    let filepath = config.get("nginxdir") + '/' + address ;
    console.log('viewOneconfig',filepath);
    fs.readFile(filepath, function(err, buf) {
        if(err)  {
            console.log('viewOneconfig err',err);
            return res.status(400).json({
                status: 400,
                msg:'Get data failed'
            });
        }
        var data ='Error';
        if(buf.toString()!=null && buf.toString()!=undefined && buf.toString()){
            data = buf.toString();

        }
        return res.status(200).json({
            status: 200,
            data: data,
            msg:'Get data in file'
        });

      });

}
exports.deleteOneconfig = async (req,res) => { 
    const address = req.body.name;
    let filepath = config.get("nginxdir") + '/' + address ;
    console.log('deleteOneconfig',filepath);
    fs.unlink(filepath, function(err) {
        if (err) {
            return res.status(400).json({
                status: 400,
                msg:'Get data in failed'
            });
        } else {
            return res.status(200).json({
                status: 200,
                msg:'Success'
            });
        }
    });

}
exports.updateOneconfig = async (req,res) => { 

    const contentnginx = req.body.contentnginx;
    const address = req.body.address;
    let filepath = config.get("nginxdir") + '/' + address ;
    fs.writeFile(filepath, contentnginx, (err) => { 
        if (err) {
            req.flash(
                'error_msg',
                'update failed'
            );
            res.redirect('/home/nginx');
        } else {
            req.flash(
                'success_msg',
                'Updated success'
            );
            res.redirect('/home/nginx');
        }

    });


}
exports.addOneconfig = async (req,res) => { 

    const contentnginx = req.body.contentnginx;
    const address = req.body.address +'.conf';
    let filepath = config.get("nginxdir") + '/' + address;

    try {
        if (!fs.existsSync(filepath)) {
            fs.writeFile(filepath, contentnginx, (err) => { 
                if (err) {
                    req.flash(
                        'error_msg',
                        'Write failed'
                    );
                    res.redirect('/home/nginx');
                } else {
                    req.flash(
                        'success_msg',
                        'Write success'
                    );
                    res.redirect('/home/nginx');
                }
        
            });
        }
        else {
            req.flash(
                'error_msg',
                'Write file failed,file exists ! '
            );
        }
      } catch(err) {
        console.error(err);
        req.flash(
            'error_msg',
            'Write file failed'
        );
      }


    


}