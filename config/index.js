// Choose config key which use depend on NODE_ENV
if (process.env.NODE_ENV === 'production') {
  // Production environment
  module.exports = require('./prod')
} else {
  // Development environment
  module.exports = require('./dev')
}
