const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../config')

module.exports = (req, res, next) => {
  const header = req.headers['authorization']

  if (typeof header !== 'undefined') {
    const bearer = header.split(' ')
    const token = bearer[1]

    req.token = token

    jwt.verify(req.token, JWT_SECRET, (err, authorizedData) => {
      if (err) {
        // If error send Forbidden (403)
        console.log(err)

        if (err.name === 'TokenExpiredError') {
          return res.json({
            error: true,
            name: err.name,
            message: err.message,
            expiredAt: err.expiredAt
          })
        }

        res.sendStatus(403)
      } else {
        next()
      }
    })

    next()
  } else {
    // If header is undefined return Forbidden (403)
    res.sendStatus(403)
  }
}
