const ctrl             = {}
const path             = require('path')
const { randomNumber } = require('../helpers/libs')
const fs               = require('fs-extra')
const { Image }        = require('../models')

ctrl.index = (req, res) => {
    
}

ctrl.create = (req, res) => {
    const saveImage = async () => {
        const imgName = randomNumber()
        const images     = await Image.find({ filaname: imgName})
        if (images.length > 0) {
            saveImage()
        } else {
            const temp       = req.file.path
            const ext        = path.extname(req.file.originalname).toLowerCase()
            const targetPath = path.resolve(`src/public/upload/${imgName}${ext}`)
            if (ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.gif') {
                await fs.rename(temp, targetPath)
                const newImg = new Image({
                    title: req.body.title,
                    filename: imgName + ext,
                    description: req.body.description
                })
                const imageSaved = await newImg.save()
                // res.redirect('/images')
                res.send('works')
            } else {
                await fs.unlink(temp)
                res.status(500).json({
                    error: 'Only images are allowed'
                })
            }
        }
    }
    saveImage()
}

ctrl.like = (req, res) => {

}

ctrl.comment = (req, res) => {

}

ctrl.remove = (req, res) => {

}

module.exports = ctrl