module.exports = (sequelize, type) => {
  return sequelize.define('classrooms', {
    id: {
      type: type.UUID,
      defaultValue: sequelize.literal('uuid_generate_v4()'),
      primaryKey: true
    },
    subjectId: { type: type.UUID },
    roomId: { type: type.UUID },
    startTime: { type: type.DATE },
    endTime: { type: type.DATE },
    enabled: { type: type.BOOLEAN, defaultValue: true }
  })
}
