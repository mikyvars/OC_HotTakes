const multer = require('multer')
const fs = require('fs')
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
}

// multer config to set files destination and rename them
const storage = multer.diskStorage({
    destination: (req, file, callback) => {

        if(!fs.existsSync('images')) {
            fs.mkdirSync('images')
        }
        
        callback(null, 'images')
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_')
        const extension = MIME_TYPES[file.mimetype]
        callback(null, name + Date.now() + '.' + extension)
    }
})

module.exports = multer({storage}).single('image')