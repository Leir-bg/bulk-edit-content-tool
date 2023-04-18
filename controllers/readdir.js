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

        // fs.readdir(dirPath, (err, files) => {
        //     let htmlFiles =  files.filter(file => path.extname(file) === '.html')
        //     let orderedFiles = htmlFiles.map(val => parseInt(val)).sort((a, b) => a - b)
        //     res.render('partials/gotfiles', {files: orderedFiles})
        // })

    }catch(e){
        console.error(e)
    }

    res.status(200);
})

module.exports = searchRoute
