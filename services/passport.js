const passport = require('passport')
const bcrypt = require('bcrypt')
const LocalStrategy = require('passport-local').Strategy
const JWTstrategy = require('passport-jwt').Strategy
const ExtractJWT = require('passport-jwt').ExtractJwt

const { Users } = require('./sequelize')

const { JWT_SECRET } = require('../config')

passport.use(
  new LocalStrategy(async (username, password, done) => {
    let user = await Users.findOne({ where: { username } }).then((user) => user)

    if (!user) {
      return done(null, false)
    }
    if (!bcrypt.compareSync(password, user.password)) {
      return done(null, false, { message: 'Wrong Password' })
    }

    user = user.dataValues

    delete user.password
    delete user.createdAt
    delete user.updatedAt

    return done(null, {
      ...user
    })
  })
)

passport.use(
  new JWTstrategy(
    {
      // secret we used to sign our JWT
      secretOrKey: JWT_SECRET,
      // we expect the user to send the token as a query paramater with the name 'secret_token'
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
    },
    async (token, done) => {
      try {
        // Pass the user details to the next middleware
        return done(null, token.user)
      } catch (error) {
        done(error)
      }
    }
  )
)

passport.serializeUser((user, done) => {
  done(null, user)
})

passport.deserializeUser((user, done) => {
  done(null, user)
})
