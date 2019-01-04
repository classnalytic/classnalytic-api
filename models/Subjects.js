module.exports = (sequelize, type) => {
  return sequelize.define('subjects', {
    id: {
      type: type.UUID,
      defaultValue: sequelize.literal('uuid_generate_v4()'),
      primaryKey: true
    },
    name: { type: type.STRING, notEmpty: false },
    description: type.TEXT
  })
}
