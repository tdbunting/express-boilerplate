const crypto = require('crypto')

exports.generateToken = () =>{
  return crypto.randomBytes(20).toString('hex')
}

exports.hashToken = (token) => {
  return crypto.createHash('sha256')
               .update(token)
               .digest('hex')
}