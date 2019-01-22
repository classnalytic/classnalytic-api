const jwt = require('jsonwebtoken')

const { JWT_SECRET, JWT_REFRESH_SECRET } = require('../config')
const { Users } = require('./sequelize')

function createToken (data, secret, expire) {
  const token = jwt.sign({ ...data }, secret, { expiresIn: expire })

  return token
}

const renewToken = async id => {
  let user = await Users.findByPk(id).then(user => user)

  user = user.dataValues

  delete user.password
  delete user.createdAt
  delete user.updatedAt

  const token = await createToken({ ...user }, JWT_SECRET, '1h')

  return [user, token]
}

const createTokens = user => {
  const token = createToken({ ...user }, JWT_SECRET, '1h')
  const refreshToken = createToken({ id: user.id }, JWT_REFRESH_SECRET, '1d')

  return [token, refreshToken]
}

module.exports = { renewToken, createTokens }
