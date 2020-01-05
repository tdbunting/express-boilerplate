const express = require('express')

const {
  register,
  login,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
  updateDetails,
  updatePassword
} = require('../controllers/auth.controller')

const { protect } = require('../middlewares/authentication')
const authRouter = express.Router()

// const NOOP = (req, res, next) => res.json({success:true, data: 'TODO'})

authRouter.post('/register', register)
authRouter.post('/login', login)
authRouter.get('/logout', logout)
authRouter.get('/me', protect, getMe)
authRouter.put('/updatedetails', protect, updateDetails)
authRouter.put('/updatepassword', protect, updatePassword)
authRouter.post('/forgotpassword', forgotPassword)
authRouter.put('/resetpassword/:resettoken', resetPassword)


module.exports = authRouter