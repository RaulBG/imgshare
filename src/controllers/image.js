const ctrl               = {}
const path               = require('path')
const { randomNumber }   = require('../helpers/libs')
const fs                 = require('fs-extra')
const { Image, Comment } = require('../models')
const md5                = require('md5')

ctrl.index = async (req, res) => {
    const viewModel = { image: {}, comments: {}}
    const image    = await Image.findOne({filename: {$regex: req.params.image_id}})
    if (image) {
        image.views        = image.views + 1
        viewModel.image    = image
        await image.save()
        const comments     = await Comment.find({image_id: image._id})
        viewModel.comments = comments
        res.render('image', viewModel)
    } else {
        res.redirect('/')
    }
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
                res.redirect('/images/' + imgName)
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

ctrl.like = async (req, res) => {
    const image = await Image.findOne({filename: {$regex: req.params.image_id}})
    image.likes = image.likes + 1
    await image.save()
    res.json({ likes: image.likes })

}

ctrl.comment = async (req, res) => {
    const image = await Image.findOne({filename: {$regex: req.params.image_id}})
    if (image) {
        const newComment    = new Comment(req.body)
        newComment.gravatar = md5(newComment.email)
        newComment.image_id = image._id
        newComment.save()
        res.redirect('/images/' + image.uniqueId)
    } else {
        res.redirect('/')
    }
}

ctrl.remove = async (req, res) => {
    const image = await Image.findOne({filename: {$regex: req.params.image_id}})
    if (image) {
        await fs.unlink(path.resolve('./src/public/upload/' + image.filename))
        await Comment.deleteOne({ image_id: image._id })
        await image.remove()
        res.json(true)
    }
}

module.exports = ctrl