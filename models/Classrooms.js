module.exports = (sequelize, type) => {
  return sequelize.define(
    'classrooms',
    {
      id: {
        type: type.UUID,
        defaultValue: sequelize.literal('uuid_generate_v4()'),
        primaryKey: true
      },
      subjectId: { type: type.UUID },
      roomId: { type: type.UUID },
      instructorId: { type: type.UUID },
      startTime: { type: type.DATE },
      endTime: { type: type.DATE },
      day: { type: type.STRING },
      enabled: { type: type.BOOLEAN, defaultValue: true }
    },
    {
      getterMethods: {
        live () {
          let originalStartTime = this.startTime
          let originalEndTime = this.endTime
          let now = new Date()

          let currentTime = {
            hour: now.getHours(),
            minute: now.getMinutes()
          }

          let startTime = {
            hour: originalStartTime.getHours(),
            minute: originalStartTime.getMinutes()
          }

          let endTime = {
            hour: originalEndTime.getHours(),
            minute: originalEndTime.getMinutes()
          }

          if (
            currentTime.hour <= endTime.hour &&
            currentTime.hour >= startTime.hour
          ) {
            if (currentTime.hour === startTime.hour) {
              if (currentTime.minute >= startTime.minute) {
                return true
              }
              return false
            }

            if (currentTime.hour === endTime.hour) {
              if (currentTime.minute < endTime.minute) {
                return true
              }
              return false
            }
            return true
          }

          return false
        }
      }
    }
  )
}
