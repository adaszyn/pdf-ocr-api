const path = require('path')

const dbConfig = {
    LOCAL: {
        client: 'sqlite3',
        connection: {
            filename: path.join(__dirname, "./mock.db")
        }
    }
}

module.exports = require('knex')(dbConfig.LOCAL);