
const multer = require('multer');

var Storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, "./uploads");
    },
    filename: function(req, file, callback) {
        callback(null, file.fieldname.replace(/\s/g, '_') + "_" + Date.now() + "_" + file.originalname);
    }
});
const uploadImage = multer({
    limits: {
        fileSize: 15 * 1024 * 1024,
      },
    storage: Storage
}).array("file",3);

const uploadFileSingle = multer({
    limits: {
        fileSize: 50 * 1024 * 1024,
      },
    storage: Storage
}).array("file", 10);

module.exports.uploadImage = uploadImage;
module.exports.uploadFile  = uploadFileSingle;