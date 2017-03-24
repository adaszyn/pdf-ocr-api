const db = require('../../../db')

function createSession (directory) {
    return db('sessions')
        .insert({
            directory,
            created_at: new Date()
        })
}

module.exports = createSession