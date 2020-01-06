const config = require('../config')
const User = require('../models/User')
const asyncHandler = require('../middlewares/asyncHandler')
const ErrorResponse = require('../utils/ErrorResponse')
const { hashToken } = require('../utils/tokens')

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
  const { username, email, password, role } = req.body

  const user = await User.create({
    username,
    email,
    password,
    role
  })

  sendTokenResponse(user, 200, res)
})

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body

  if (!email || !password)
    return next(new ErrorResponse('Please provide an email and password', 400))

  const user = await User.findOne({ email }).select('+password')
  
  if (!user)
    return next(new ErrorResponse('Invalid credentials', 401))

  const isMatch = await user.comparePassword(password)

  if (!isMatch)
    return next(new ErrorResponse('Invalid credentials', 401))
  
  sendTokenResponse(user, 200, res)
})

// @desc    Logout user and clear cookie
// @route   GET /api/v1/auth/logout
// @access  Private
exports.logout = asyncHandler(async (req, res, next) => {
  // TODO: REMOVE COOKIE ONCE IMPLEMENTED
  res.status(200).json({
    success: true,
    data: {}
  })
})

// @desc    Get currently logged in user
// @route   POST /api/v1/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res, next) => {
  // TODO: COOKIE IMPLEMENTATION IF ADDED
  // JWT IMPLEMENTATION
  const user = await User.findById(req.user.id)
  res.status(200).json({
    success: true,
    data: user
  })
})

// @desc    Update user details
// @route   PUT /api/v1/auth/updatedetails
// @access  Private
exports.updateDetails = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = updateDetailsFieldsAllowed({ ...req.body })

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true
  })

  res.status(200).json({
    success: true,
    data: user
  })
})

// @desc    Update user password
// @route   PUT /api/v1/auth/updatepassword
// @access  Private
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const user = await (await User.findById(req.user.id)).select('+password')

  if(!(await user.comparePassword(req.body.currentPassword))) {
    return next(new ErrorResponse('Password is incorrect', 401))
  }

  user.password = req.body.newPassword
  await user.save()

  sendTokenResponse(user, 200, res)
})

// @desc    Update user details
// @route   POST /api/v1/auth/forgotpassword
// @access  Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email })

  if (!user)
    return next(new ErrorResponse('No user found with that email', 404))

  const resetToken = user.getResetPasswordToken()
  await user.save({ validateBeforeSave: false })

  // path for resetting password
  const resetUrl= `${req.protocol}://${res.get('host')}/api/v1/auth/resetpassword/${resetToken}`

  try {
    // TODO: IMPLEMENT A MAILER SOLUTION
    res.status(200).json({
      success: true,
      data: 'Email sent'
    })
  } catch (err) {
    console.error(err)
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined

    await user.save({ validateBeforeSave: false })

    return next(new ErrorResponse('Email could not be sent', 500))
  }
})

// @desc    Reset password
// @route   PUT /api/v1/auth/resetpassword/:resettoken
// @access  Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  const resetPasswordToken = hashToken(req.params.resettoken)

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  })

  if (!user)
    return next(new ErrorResponse('Invalid token', 400))
  
  user.password = req.body.password
  user.resetPasswordToken = undefined
  user.resetPasswordExpire = undefined
  user.save()

  sendTokenResponse(user, 200, res)
})


// PRIVATE FUNCTIONS
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken()

  const options = {
    expires: new Date(
      Date.now() + config.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    )
  }

  if (config.NODE_ENV === 'production') {
    options.secure = true
  }

  res.status(statusCode).json({
    success: true, 
    token
  })
}

const updateDetailsFieldsAllowed = (params) => {
  if(params.username)
    delete params.username
  if(params.email)
    delete params.email
  if(params.password)
    delete params.password

  return params
}