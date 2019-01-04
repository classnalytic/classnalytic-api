module.exports = (sequelize, type) => {
  return sequelize.define('enrolls', {
    id: {
      type: type.UUID,
      defaultValue: sequelize.literal('uuid_generate_v4()'),
      primaryKey: true
    },
    userId: { type: type.UUID },
    classroomId: { type: type.UUID },
    role: {
      type: type.ENUM('admin', 'teacher', 'teaching assistant', 'student'),
      defaultValue: 'student'
    }
  })
}
