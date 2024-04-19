const { Pool } = require('pg')

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'mysecretpassword',
    port: 5432,
    database: process.env.DB_NAME || 'b2biys',
    max: 20,
    connectionTimeoutMillis: 2000,
})

module.exports = pool
