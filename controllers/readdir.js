const express = require('express')
const fs = require('fs')
const path = require('path')

const searchRoute = express.Router()

searchRoute.post('/', (req, res, next) => {

    let dirPath = req.body.dirPath

    try{
        if(!dirPath) throw new Error('Path cannot be empty!')

        fs.readdir(dirPath, (err, files) => {
            let htmlFiles =  files.filter(file => path.extname(file) === '.html')
            res.render('partials/gotfiles', {files: htmlFiles, path: dirPath})
        })

    }catch(e){
        console.error(e)
    }

    res.status(200);
})

module.exports = searchRoute
