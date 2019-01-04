module.exports = (sequelize, type) => {
  return sequelize.define('actions', {
    id: {
      type: type.UUID,
      defaultValue: sequelize.literal('uuid_generate_v4()'),
      primaryKey: true
    },
    userId: { type: type.UUID },
    classroomId: { type: type.UUID },
    action: { type: type.STRING },
    time: { type: type.DATE, defaultValue: type.NOW }
  })
}
