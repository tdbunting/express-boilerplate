const express = require('express')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')

// Custom Module Imports
const router = require('./routes')
const errorHandler = require('./middlewares/errorHandler')

// Initialize db instance
require('./db')

// Create app instance
const app = express()

// Initialize middlewares
app.use(express.json())
app.use(cookieParser())
app.use(morgan('dev'))

// Initialize Routes
app.use(router)

app.use((err, req, res, next) => {
  console.log(err)
  next(err)
})

// Initialize Error Handlers
app.use(errorHandler)


module.exports = app