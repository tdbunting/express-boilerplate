const mongoose = require('mongoose')
const config = require('./keys')

const mongoDbHost = config.MONGO_DOCKER_HOST || config.MONGO_DB_HOST || 'localhost:27017'

mongoose.connect(`mongodb://${mongoDbHost}/`, {
  dbName: config.MONGO_DB_NAME,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
})

const { connection: db } = mongoose

db.on('connected', () => {
  console.log('Database Connected')
})

db.on('disconnected', () => {
  console.log('Database Disconnected')
})

db.on('error', error => {
  console.error(error)
})

module.exports = db