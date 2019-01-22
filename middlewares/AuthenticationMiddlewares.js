const jwt = require('jsonwebtoken')

const { renewToken } = require('../services/token')

const { JWT_SECRET, JWT_REFRESH_SECRET, COOKIE_DOMAIN } = require('../config')

module.exports = (req, res, next) => {
  if (typeof req.cookies.token !== 'undefined') {
    const token = req.cookies.token
    const refreshToken = req.cookies.refreshToken

    jwt.verify(token, JWT_SECRET, (err, authorizedData) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          jwt.verify(
            refreshToken,
            JWT_REFRESH_SECRET,
            async (err, refreshData) => {
              if (err) {
                return res.json({
                  error: true,
                  name: err.name,
                  message: err.message,
                  expiredAt: err.expiredAt
                })
              } else {
                const [user, token] = await renewToken(refreshData.id)
                res.cookie('token', token, {
                  domain: COOKIE_DOMAIN,
                  secure: true
                })

                req.info = user

                next()
              }
            }
          )
        } else if (err.name === 'JsonWebTokenError') {
          return res.json({
            error: true,
            name: err.name,
            message: err.message,
            expiredAt: err.expiredAt
          })
        } else {
          return res.json({
            error: true,
            name: 'Unauthorized'
          })
        }
      } else {
        req.info = authorizedData
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
