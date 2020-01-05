const { Router } = require('express')
const appRouter = new Router()

appRouter.get('/', (req, res, next) => {
  res.json({
    success: true,
    data: 'Hello World'
  })
})

module.exports = appRouter