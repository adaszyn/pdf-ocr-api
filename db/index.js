function getConfig() {
    switch (process.env.NODE_ENV) {
        case 'production':
            return require('./production.config')
        case 'development':
            return require('./development.config')
        case 'local':
        default:
            return require('./local.config')
    }
}

module.exports = require('knex')(getConfig());