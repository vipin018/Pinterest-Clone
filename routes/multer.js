const multer = require("multer");
const { v4: uuidv4 } = require("uuid"); // v4 means version 4
const path = require('path');

const uploadDir = path.join(__dirname, '../public/images/uploads');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir)
    },
    filename: function (req, file, cb) {
        const uniqueFileName = uuidv4();
        cb(null, uniqueFileName + path.extname(file.originalname));
    }
})

const upload = multer({ storage: storage })

module.exports = upload;