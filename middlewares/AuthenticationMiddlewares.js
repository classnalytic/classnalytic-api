const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../config')

module.exports = (req, res, next) => {
  if (typeof req.cookies.token !== 'undefined') {
    const token = req.cookies.token

    req.token = token

    jwt.verify(req.token, JWT_SECRET, (err, authorizedData) => {
      if (err) {
        console.log(err)
        if (err.name === 'TokenExpiredError') {
          return res.json({
            error: true,
            name: err.name,
            message: err.message,
            expiredAt: err.expiredAt
          })
        }

        if (err.name === 'JsonWebTokenError') {
          return res.json({
            error: true,
            name: err.name,
            message: err.message,
            expiredAt: err.expiredAt
          })
        }

        return res.json({
          error: true,
          name: 'Unauthorized'
        })
      } else {
        req.info = authorizedData.user
        next()
      }
    })
  } else {
    // If header is undefined return Forbidden (403)
    return res.json({
      error: true,
      name: 'Unauthorized'
    })
  }
}
