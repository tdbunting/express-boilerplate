const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require ('jsonwebtoken')
const { generateToken, hashToken } = require('../utils/tokens')
const config = require('../config')

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: [true, 'Please add a username']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false
  },
  verified: String,
  verificationToken: String,
  verificationExpire: Date,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
})

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next()
  }

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password)
}

UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRE
  })
}

UserSchema.methods.getVerificationToken = function () {
  const confirmationToken = generateToken()

  this.verificationToken = hashToken(confirmationToken)
  this.verificationExpire = Date.now() + 10 * 60 * 1000

  return confirmationToken
}

UserSchema.methods.getResetPasswordToken = function () {
  const resetToken = generateToken()

  this.resetPasswordToken = hashToken(resetToken)
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000

  return resetToken
}

UserSchema.statics.EmailConfirmationStates = {
  'Verified': 'verified',
  'Sent': 'sent',
  'Resent': 'resent'
}

module.exports = mongoose.model('User', UserSchema)