const User = require('../models/User')
const asyncHandler = require('../middlewares/asyncHandler')

// @desc    Get all users
// @route   GET /api/v1/users
// @access  Private/Admin
exports.getUsers = asyncHandler(async(req, res, next) => {
  res.status(200).json(res.advancedResults)
})

// @desc    Get User by id
// @route   GET /api/v1/users/:id
// @access  Private/Admin
exports.getUser = asyncHandler(async(req, res, next) => {
  res.status(200).json({
    success: true,
    data: {}
  })
})

// @desc    Create new user
// @route   POST /api/v1/users
// @access  Private/Admin
exports.createUser = asyncHandler(async(req, res, next) => {
  res.status(200).json({
    success: true,
    data: {}
  })
})

// @desc    Update user by id
// @route   PUT /api/v1/users/:id
// @access  Private/Admin
exports.updateUser = asyncHandler(async(req, res, next) => {
  res.status(200).json({
    success: true,
    data: {}
  })
})

// @desc    Delete user by id
// @route   DELETE /api/v1/users/:id
// @access  Private/Admin
exports.deleteUser = asyncHandler(async(req, res, next) => {
  res.status(200).json({
    success: true,
    data: {}
  })
})