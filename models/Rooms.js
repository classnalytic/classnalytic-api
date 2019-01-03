const uuid = require('uuid/v4')

module.exports = (sequelize, type) => {
  return sequelize.define('rooms', {
    id: {
      type: type.UUID,
      defaultValue: uuid(),
      primaryKey: true
    },
    name: { type: type.STRING, notEmpty: false },
    description: type.TEXT
  })
}
