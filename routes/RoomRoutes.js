const express = require('express')
const uuid = require('uuid/v4')

const router = express.Router()

const AuthticationMiddleware = require('../middlewares/AuthenticationMiddlewares')
const {
  Rooms
} = require('../services/sequelize')

router.use(AuthticationMiddleware)

router.post('/all', async (req, res) => {
  let rooms = await Rooms.findAll({
    order: ['createdAt']
  })

  return res.send(rooms)
})

router.post('/create', async (req, res) => {
  let name = req.body.name
  let description = req.body.description

  await Rooms.create({ id: uuid(), name, description }).catch(e => console.log(e))

  return res.send({ success: true })
})

module.exports = router
