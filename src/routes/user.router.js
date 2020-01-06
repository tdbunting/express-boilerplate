const express = require('express')

const User = require('../models/User')
const { 
  getUser,
  getUsers,
  createUser,
  updateUser,
  deleteUser
} = require('../controllers/user.controller')

const advancedResults = require('../middlewares/advancedResults')
const { protect, authorize } = require('../middlewares/authentication')

const userRouter = express.Router()

userRouter.use(protect)
userRouter.use(authorize('admin'))

userRouter
  .route('/')
  .get(advancedResults(User), getUsers)
  .post(createUser)

userRouter
  .route('/:id')
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser)

module.exports = userRouter