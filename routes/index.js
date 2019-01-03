const express = require('express')
const router = express.Router()

// Child Routes
const AuthRoutes = require('./AuthRoutes')
const ClassroomRoutes = require('./ClassroomRoutes')
const StudentRoutes = require('./StudentRoutes')
const RoomRoutes = require('./RoomRoutes')
const SubjectRoutes = require('./SubjectRoutes')

module.exports = app => {
  // Custom route like authentication

  router.use('/auth', AuthRoutes)
  router.use('/classroom', ClassroomRoutes)
  router.use('/room', RoomRoutes)
  router.use('/subject', SubjectRoutes)
  router.use('/student', StudentRoutes)

  router.get('/', (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    res.status(200).json({
      status: 200,
      message: 'Healthy!'
    })
  })

  app.use('/api', router)
}
