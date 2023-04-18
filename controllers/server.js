const express = require('express')
const server = express.Router()

server.get('/', (req, res) => {
    res.render('index')
})

module.exports = server