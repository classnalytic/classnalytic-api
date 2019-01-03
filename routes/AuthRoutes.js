const express = require('express')
const passport = require('passport')

const jwt = require('jsonwebtoken')

const router = express.Router()

const AuthenticationMiddleware = require('../middlewares/AuthenticationMiddlewares')

const { JWT_SECRET } = require('../config')

router.get('/me', AuthenticationMiddleware, (req, res) => {
  jwt.verify(req.token, 'top_secret', (err, authorizedData) => {
    if (err) {
      // If error send Forbidden (403)
      console.log('ERROR: Could not connect to the protected route')
      console.log(err)
      res.sendStatus(403)
    } else {
      // If token is successfully verified, we can send the autorized data
      res.json({
        message: 'Successful log in',
        authorizedData
      })
      console.log('SUCCESS: Connected to protected route')
    }
  })
})

router.post('/', (req, res, next) => {
  passport.authenticate('local', (err, user) => {
    if (err) {
      return res.json({ success: false, login: false, info: {} })
    }

    if (!user) {
      return res.json({ success: false, login: false, info: {} })
    }

    req.logIn(user, async err => {
      if (err) {
        return next(err)
      }

      const body = { ...user }
      // Sign the JWT token and populate the payload with the user email and id
      const token = jwt.sign({ user: body }, JWT_SECRET, { expiresIn: '1h' })

      return res.json({
        success: true,
        login: true,
        token,
        info: {
          ...user
        }
      })
    })
  })(req, res, next)
})

router.post('/logout', (req, res) => {
  req.logout()
  return res.json({
    success: true
  })
})

module.exports = router
