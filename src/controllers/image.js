const ctrl             = {}
const path             = require('path')
const { randomNumber } = require('../helpers/libs')
const fs               = require('fs-extra')

ctrl.index = (req, res) => {
    
}

ctrl.create = async (req, res) => {
    const imgName    = randomNumber()
    const temp       = req.file.path
    const ext        = path.extname(req.file.originalname).toLowerCase()
    const targetPath = path.resolve(`src/public/upload/${imgName}${ext}`)
    if (ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.gif') {
        await fs.rename(temp, targetPath)
    }
    res.send('It works!')
}

ctrl.like = (req, res) => {

}

ctrl.comment = (req, res) => {

}

ctrl.remove = (req, res) => {

}

module.exports = ctrl