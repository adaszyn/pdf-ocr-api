const db = require('../../../db')
const moment = require('moment')

function createSession (directory) {
    return db('sessions')
        .insert({
            directory,
            created_at: moment().unix()
        })
}

module.exports = createSession