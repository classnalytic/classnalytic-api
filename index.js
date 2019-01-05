const express = require('express')
// const cookieSession = require('cookie-session')
const cookieParser = require('cookie-parser')
const passport = require('passport')
const bodyParser = require('body-parser')
const helmet = require('helmet')

const app = express()

// Use helmet for addional security
app.use(helmet())

// Body Parser
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true
  })
)
app.use(cookieParser())

// app.use(
//   cookieSession({
//     maxAge: 12 * 60 * 60 * 1000,
//     keys: ['lel'],
//     cookie: {
//       secure: true
//     }
//   })
// )
// Initialize passport.js
app.use(passport.initialize())
// app.use(passport.session())
require('./services/passport')

// DB Service
require('./services/sequelize')

// Main route file
require('./routes/index')(app)

// Use port 5000 if not define in variable
const PORT = process.env.PORT || 5000

if (process.env.NODE_ENV === 'production') {
  app.listen(PORT)
} else {
  const { createServer } = require('https')
  const path = require('path')
  const fs = require('fs')
  const ssl = {
    key: fs.readFileSync(path.resolve('cert/server.key')),
    cert: fs.readFileSync(path.resolve('cert/server.crt'))
  }
  createServer(ssl, app).listen(PORT)
}
