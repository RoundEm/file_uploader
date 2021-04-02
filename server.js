const express = require('express')
const multer = require('multer')
const exphbs = require('express-handlebars')
const path = require('path')

const app = express()
app.engine('handlebars', exphbs())
app.set('view engine', 'handlebars')
// app.use(express.json())
// app.use(express.urlencoded({ extended: false }))
// app.use(express.static(path.join(__dirname, 'public')))
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
const upload = multer({ 
    storage: storage 
}).single('petImgUpload')

app.post('/upload', (req, res) => {
    upload(req, res, err => {
        if (err) {
            console.log(`err: `, err)
            res.render('home', {
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