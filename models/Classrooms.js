const uuid = require('uuid/v4')

module.exports = (sequelize, type) => {
  return sequelize.define('classrooms', {
    id: {
      type: type.UUID,
      defaultValue: uuid(),
      primaryKey: true
    },
    subjectId: { type: type.UUID },
    roomId: { type: type.UUID },
    startTime: { type: type.DATE },
    endTime: { type: type.DATE },
    enabled: { type: type.BOOLEAN, defaultValue: true }
  })
}
