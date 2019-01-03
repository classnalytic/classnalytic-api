const express = require('express')
const { Op } = require('sequelize')
const uuid = require('uuid/v4')

const router = express.Router()

const AuthticationMiddleware = require('../middlewares/AuthenticationMiddlewares')
const {
  Enrolls,
  Users,
  Classrooms,
  Rooms,
  Subjects,
  Actions,
  Emotions,
  Attendance,
  sequelize
} = require('../services/sequelize')

router.use(AuthticationMiddleware)

router.post('/', async (req, res) => {
  let user = req.user
  let classrooms = await Enrolls.findAll({
    where: { userId: user.id },
    order: ['createdAt'],
    include: [
      { model: Users, attributes: { exclude: ['password'] } },
      { model: Classrooms, include: [Rooms, Subjects] }
    ]
  })

  return res.send(classrooms)
})

router.post('/all', async (req, res) => {
  let classrooms = await Classrooms.findAll({
    order: ['createdAt'],
    include: [Rooms, Subjects]
  })
  return res.send(classrooms)
})

router.post('/save', async (req, res) => {
  let id = req.body.id
  let data = JSON.parse(req.body.data)
  let today = new Date().toDateString({
    day: 'numberic',
    month: 'numberic',
    year: 'numberic'
  })

  data.forEach(async student => {
    if (student.name === 'Unknown') {
      return
    }

    let user = await Users.find({ where: { studentId: student.name } })

    if (!user) {
      return
    }

    let emotions = student.emotions

    let emotion = Object.keys(emotions).reduce((a, b) => (emotions[a] > emotions[b] ? a : b))

    let action = student.action

    let attendance = await Attendance.find({
      where: {
        userId: user.id,
        classroomId: id,
        time: {
          [Op.between]: [new Date(today + ' 00:00:00'), new Date(today + ' 23:59:59')]
        }
      }
    })

    if (!attendance) {
      Attendance.create({
        id: uuid(),
        userId: user.id,
        classroomId: id
      })
    }

    Emotions.create({
      id: uuid(),
      userId: user.id,
      classroomId: id,
      emotion: emotion
    }).catch(err => console.log(err))

    if (action !== 'null') {
      Actions.create({
        id: uuid(),
        userId: user.id,
        classroomId: id,
        action: action
      }).catch(err => console.log(err))
    }
  })

  return res.send({ id, data })
})

router.post('/form', async (req, res) => {
  let subjects = await Subjects.findAll()
  let rooms = await Rooms.findAll()
  let instructors = await Users.findAll({
    where: { role: 'teacher' },
    attributes: { exclude: ['password'] }
  })

  return res.send({ subjects, rooms, instructors })
})

router.post('/create', async (req, res) => {
  let roomId = req.body.room
  let subjectId = req.body.subject
  let instructorId = req.body.instructor
  let startTime = req.body.startTime
  let endTime = req.body.endTime

  let classroomId = await Classrooms.create({ id: uuid(), roomId, subjectId, startTime, endTime })
    .then(r => r.get('id'))
    .catch(e => console.log(e))

  await Enrolls.create({ id: uuid(), userId: instructorId, classroomId, role: 'admin' }).catch(e => console.log(e))

  return res.send({ classroomId })
})

router.post('/:id', async (req, res) => {
  let id = req.params.id

  let classroom = await Classrooms.findById(id, {
    include: [Subjects, Rooms]
  })
    .then(async data => {
      if (!data) {
        return { found: false }
      }

      let today = new Date().toDateString({
        day: 'numberic',
        month: 'numberic',
        year: 'numberic'
      })

      let attendances = await Attendance.findAll({
        where: {
          classroomId: id,
          createdAt: {
            [Op.between]: [new Date(today + ' 00:00:00'), new Date(today + ' 23:59:59')]
          }
        },
        order: [['createdAt', 'DESC']],
        include: {
          model: Users,
          attributes: { exclude: ['password'] }
        }
      })

      let emotions = await Emotions.findAll({
        where: {
          classroomId: id,
          createdAt: {
            [Op.between]: [new Date(today + ' 00:00:00'), new Date(today + ' 23:59:59')]
          }
        },
        group: ['emotion'],
        attributes: ['emotion', [sequelize.fn('COUNT', 'emotion'), 'count']]
      })

      let percent = {
        sadness: '0',
        fear: '0',
        neutral: '0',
        surprise: '0',
        happiness: '0',
        contempt: '0',
        disgust: '0',
        anger: '0'
      }

      if (emotions.length !== 0) {
        let total = emotions.map(e => parseInt(e.dataValues.count)).reduce((a, b) => a + b)

        await emotions.forEach(emotion => {
          percent[emotion.emotion] = parseFloat((parseInt(emotion.dataValues.count) / total) * 100).toFixed(2)
        })
      }

      let actions = await Actions.findAll({
        where: {
          classroomId: id,
          createdAt: {
            [Op.between]: [new Date(today + ' 00:00:00'), new Date(today + ' 23:59:59')]
          }
        },
        order: [['createdAt', 'DESC']],
        include: {
          model: Users,
          attributes: { exclude: ['password'] }
        }
      })

      return { ...data.toJSON(), actions, emotions: percent, attendances, found: true }
    })
    .catch(() => ({ found: false }))

  return res.send({ ...classroom })
})

router.post('/:id/report', async (req, res) => {
  let id = req.params.id
  let date = req.body.date

  let attendances = await Attendance.findAll({
    where: {
      classroomId: id,
      createdAt: {
        [Op.between]: [new Date(date + ' 00:00:00'), new Date(date + ' 23:59:59')]
      }
    },
    order: [['createdAt', 'DESC']],
    include: {
      model: Users,
      attributes: { exclude: ['password'] }
    }
  })

  let emotions = await Emotions.findAll({
    where: {
      classroomId: id,
      createdAt: {
        [Op.between]: [new Date(date + ' 00:00:00'), new Date(date + ' 23:59:59')]
      }
    },
    group: ['emotion'],
    attributes: ['emotion', [sequelize.fn('COUNT', 'emotion'), 'count']]
  })

  let percent = {
    sadness: '0',
    fear: '0',
    neutral: '0',
    surprise: '0',
    happiness: '0',
    contempt: '0',
    disgust: '0',
    anger: '0'
  }

  if (emotions.length !== 0) {
    let total = emotions.map(e => parseInt(e.dataValues.count)).reduce((a, b) => a + b)

    await emotions.forEach(emotion => {
      percent[emotion.emotion] = parseFloat((parseInt(emotion.dataValues.count) / total) * 100).toFixed(2)
    })
  }

  let actions = await Actions.findAll({
    where: {
      classroomId: id,
      createdAt: {
        [Op.between]: [new Date(date + ' 00:00:00'), new Date(date + ' 23:59:59')]
      }
    },
    order: [['createdAt', 'DESC']],
    include: {
      model: Users,
      attributes: { exclude: ['password'] }
    }
  })

  return res.send({ actions, emotions: percent, attendances, found: true })
})

module.exports = router
