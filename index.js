const express = require("express")
const path = require("path")
const { getPortPromise } = require("portfinder")
const server = require("./controllers/server")
const readdir = require("./controllers/readdir")
const updatefiles = require("./controllers/updatefiles")

const app = express()

app.use(express.urlencoded({ extended: true }))
app.set('views', path.join(__dirname, 'views'))
app.set("view engine", "pug")
app.use(express.static(path.join(__dirname, "public")))

app.use('/', server)
app.use('/', readdir)
app.use('/', updatefiles)

getPortPromise({ startPort: 8000, stopPort: 8050 })
    .then((openport) => {
        app.listen(openport, 'localhost', () => {
            console.log(`Listening at port: ${openport}`)
            require('open')(`http://localhost:${openport}`)
        })
    })
    .catch((err) => {
        console.error(err)
    })
