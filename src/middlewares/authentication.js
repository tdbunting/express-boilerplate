const jwt = require('jsonwebtoken')
const config = require('../config/keys')
const asyncHandler = require('./asyncHandler')
const ErrorResponse = require('../utils/ErrorResponse')
const User = require('../models/User')

exports.protect = asyncHandler(async (req, res, next) => {
  let token

  if(
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1]
  }// TODO: HANDLE COOKIES IF IMPLEMENTED

  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route', 401))
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET)
    
    const user = await User.findById(decoded.id)
    if (!user)
      return next(new ErrorResponse('Not authorized to access this route', 401))

    req.user = user

    next()
  } catch (err) {
    return next(new ErrorResponse('Not authorized to access this route', 401))
  }
})

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User role ${req.user.role} is not authorized to access this route`,
          403
        )
      )
    }
  }
}