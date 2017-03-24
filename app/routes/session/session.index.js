const db = require('../../../db/index')

async function handler (ctx) {
    const sessions = await db('sessions')
        .where(1, '=', 1)
    ctx.body = {
        sessions
    }
}

module.exports = handler