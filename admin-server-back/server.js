/*
1. use express to start the server
2. use mongoose to connect to the database
 */
const mongoose = require('mongoose')
const express = require('express')
const app = express()

app.use(express.static('public'))
app.use(express.urlencoded({extended: true})) // request body: name=tom&pwd=123
app.use(express.json()) // request json: {name: tom, pwd: 123}
// cookie
const cookieParser = require('cookie-parser')
app.use(cookieParser())
// routers
const indexRouter = require('./routers')
app.use('/', indexRouter)

const fs = require('fs')

mongoose
    .connect('mongodb://localhost/cms_db', {useNewUrlParser: true})
    .then(() => {
        console.log('connected to the database')
        // start server after connected to the database
        app.listen('5000', () => {
            console.log('server starts successfully, http://localhost:5000')
        })
    })
    .catch(error => {
        console.error('failed to connect to the database', error)
    })