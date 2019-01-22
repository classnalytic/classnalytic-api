const express = require('express')
const passport = require('passport')

const router = express.Router()

const AuthenticationMiddleware = require('../middlewares/AuthenticationMiddlewares')

const { createTokens } = require('../services/token')

const { COOKIE_DOMAIN } = require('../config')

router.get('/', AuthenticationMiddleware, (req, res) => {
  res.json({
    message: 'Successful log in',
    data: req.token
  })
})

router.post('/', (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user) => {
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

      const [token, refreshToken] = createTokens(user)

      res.cookie('token', token, {
        domain: COOKIE_DOMAIN,
        secure: true
      })

      res.cookie('refreshToken', refreshToken, {
        domain: COOKIE_DOMAIN,
        secure: true
      })

      return res.json({
        success: true,
        login: true,
        info: {
          ...user
        }
      })
    })
  })(req, res, next)
})

router.post('/logout', (req, res) => {
  res.clearCookie('token')
  res.clearCookie('refreshToken')

  return res.json({
    success: true
  })
})

module.exports = router
