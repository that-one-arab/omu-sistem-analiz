const { Pool } = require('pg')

const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: 'mysecretpassword',
    port: 5432,
    database: 'b2biys',
    max: 20,
    connectionTimeoutMillis: 2000,
})

module.exports = pool
