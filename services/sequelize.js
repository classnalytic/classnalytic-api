const Sequelize = require('sequelize')
const { DB_HOST, DB_NAME, DB_USER, DB_PASS } = require('../config/index')

// Model import
const UsersModel = require('../models/Users')
const ClassroomsModel = require('../models/Classrooms')
const SubjectsModel = require('../models/Subjects')
const RoomsModel = require('../models/Rooms')
const EnrollsModel = require('../models/Enrolls')
const EmotionsModel = require('../models/Emotions')
const AttendanceModel = require('../models/Attendance')
const ActionsModel = require('../models/Actions')

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  dialect: 'postgres',
  logging: process.env.NODE_ENV !== 'production' && console.log,
  operatorsAliases: false
})

// Use model
const Users = UsersModel(sequelize, Sequelize)
const Classrooms = ClassroomsModel(sequelize, Sequelize)
const Subjects = SubjectsModel(sequelize, Sequelize)
const Rooms = RoomsModel(sequelize, Sequelize)
const Enrolls = EnrollsModel(sequelize, Sequelize)
const Emotions = EmotionsModel(sequelize, Sequelize)
const Attendance = AttendanceModel(sequelize, Sequelize)
const Actions = ActionsModel(sequelize, Sequelize)

// Join Classroom to Subjects, Rooms, Enrolls, Emotions, Actions and Attendance
Classrooms.belongsTo(Subjects, { foreignKey: 'subjectId' })
Classrooms.belongsTo(Rooms, { foreignKey: 'roomId' })
Classrooms.hasMany(Enrolls, { foreignKey: 'classroomId', sourceKey: 'id' })
Classrooms.hasMany(Emotions, { foreignKey: 'classroomId', sourceKey: 'id' })
Classrooms.hasMany(Actions, { foreignKey: 'classroomId', sourceKey: 'id' })
Classrooms.hasMany(Attendance, { foreignKey: 'classroomId', sourceKey: 'id' })

// Join Enrolls to Classrooms and Users
Enrolls.belongsTo(Classrooms, { foreignKey: 'classroomId' })
Enrolls.belongsTo(Users, { foreignKey: 'userId' })

// Join Emotions with Users and Classrooms
Emotions.belongsTo(Users, { foreignKey: 'userId' })
Emotions.belongsTo(Classrooms, { foreignKey: 'classroomId' })

// Join Attendance with Users and Classrooms
Attendance.belongsTo(Users, { foreignKey: 'userId' })
Attendance.belongsTo(Classrooms, { foreignKey: 'classroomId' })

// Join Actions with Users and Classrooms
Actions.belongsTo(Users, { foreignKey: 'userId' })
Actions.belongsTo(Classrooms, { foreignKey: 'classroomId' })

sequelize.sync({ force: false }).then(() => {
  console.log(`Database & tables created!`)
})

module.exports = {
  Users,
  Classrooms,
  Subjects,
  Rooms,
  Enrolls,
  Emotions,
  Attendance,
  Actions,
  sequelize
}
