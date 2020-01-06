const { Router } = require('express')

// All router imports
const authRouter = require('./routes/auth.router')

// To hold all routes for api v1
const v1ApiRouter = new Router()
v1ApiRouter.use('/auth', authRouter)

// app router in case we need statics at any point or a new api router
const appRouter = new Router()
appRouter.get('/', (req, res, next) => {
  res.json({
    success: true,
    data: 'Hello World'
  })
})
appRouter.use('/api/v1', v1ApiRouter)



module.exports = appRouter