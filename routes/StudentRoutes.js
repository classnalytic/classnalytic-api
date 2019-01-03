const express = require('express')

const router = express.Router()

const AuthticationMiddleware = require('../middlewares/AuthenticationMiddlewares')
const { Users, Attendance } = require('../services/sequelize')

router.use(AuthticationMiddleware)

router.post('/all', async (req, res) => {
  let users = await Users.findAll({
    where: {
      role: 'student'
    },
    attributes: { exclude: ['password'] }
  })

  return res.send(users)
})

router.post('/classroom', async (req, res) => {
  let classroomId = req.body.classroomId
  let studentId = req.user.id

  let attendances = await Attendance.findAll({
    where: {
      classroomId,
      userId: studentId
    },
    order: [['createdAt', 'DESC']],
    include: {
      model: Users,
      attributes: { exclude: ['password'] }
    }
  })

  return res.send([...attendances])
})

router.post('/:id', async (req, res) => {
  let id = req.params.id

  let user = await Users.findById(id)
    .then(data => {
      if (!data) {
        return { found: false }
      }

      delete user.password

      return { ...data.toJSON(), found: true }
    })
    .catch(() => ({ found: false }))

  return res.send({ ...user })
})

module.exports = router
