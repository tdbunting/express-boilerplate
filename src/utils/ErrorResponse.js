class ErrorResponse extends Error {
  constructor (message, statusCode) {
    super(message)
    this.statusCode = statusCode
    console.error('NEW ERROR RESPONSE CREATED')
    Error.captureStackTrace(this, this.constructor)
  }
}

module.exports = ErrorResponse