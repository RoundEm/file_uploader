const express = require('express')
const multer = require('multer')
const exphbs = require('express-handlebars')
const path = require('path')

const app = express()
app.engine('handlebars', exphbs())
app.set('view engine', 'handlebars')
// app.use(express.json())
// app.use(express.urlencoded({ extended: false }))
app.use(express.static('public'))

const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: (req, file, cb) => {
        cb( null, 
            file.fieldname + 
            '-' + 
            Date.now() + 
            path.extname(file.originalname)
        )
    }
})

function checkFileType(file, cb) {
    const allowedTypes = ['jpeg', 'jpg', 'png', 'gif']
    const allowedTypesRegEx = new RegExp(`/${allowedTypes.join('|')}/`)
    const extName = allowedTypesRegEx.test(path.extname(file.originalname).toLowerCase())
    const mimeType = allowedTypesRegEx.test(file.mimetype)
    
    if (extName && mimeType) {
        return cb(null, true)
    } else {
        cb(`Error: File type must be one of the following: ${allowedTypes.join(', ')}`)
    }
}

const upload = multer({ 
    storage: storage,
    // fileSize unit is byte. TODO: what are common limits?
    limit: { fileSize: 1_000_000 } ,
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb)
    }
}).single('petImgUpload')

app.post('/upload', (req, res) => {
    upload(req, res, err => {
        if (err) {
            console.log(`err: `, err)
            res.render('fileUploadError', {
                msg: err
            })
        } else {
            TODO:
            console.log(`req.file: `, req.file)
            res.send('test')
        }
    })
})

app.get('/', (req, res) => {
    res.render('fileUploaderInput')
})

const port = process.env.PORT | 3001
app.listen(port, () => console.log(`Server is running on port ${port}`))