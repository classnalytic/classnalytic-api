const uuid = require('uuid/v4')

module.exports = (sequelize, type) => {
  return sequelize.define('attendance', {
    id: {
      type: type.UUID,
      defaultValue: uuid(),
      primaryKey: true
    },
    userId: { type: type.UUID },
    classroomId: { type: type.UUID },
    time: { type: type.DATE, defaultValue: type.NOW }
  })
}
