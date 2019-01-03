const uuid = require('uuid/v4')

module.exports = (sequelize, type) => {
  return sequelize.define('users', {
    id: {
      type: type.UUID,
      defaultValue: uuid(),
      primaryKey: true
    },
    username: { type: type.STRING, notEmpty: true },
    password: { type: type.STRING, notEmpty: true },
    studentId: type.STRING,
    firstname: { type: type.TEXT, notEmpty: true },
    lastname: { type: type.TEXT, notEmpty: true },
    enabled: { type: type.BOOLEAN, defaultValue: true },
    role: { type: type.ENUM('teacher', 'student', 'admin'), defaultValue: 'student' }
  })
}
