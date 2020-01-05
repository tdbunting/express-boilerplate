const asyncHandler = fn => (req, res, next) => {
  return new Promise.resolve(fn(req, res, next)).catch(next)
}

module.exports = asyncHandler