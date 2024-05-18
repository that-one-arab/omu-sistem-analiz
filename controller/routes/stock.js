const express = require('express')
const pool = require('../database/index')

const app = (module.exports = express())

// Get all devices
app.get('/devices/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM devices')
        res.json(result.rows)
    } catch (error) {
        console.error(error)
        res.status(500).send('Server Error')
    }
})

// Add a new device
app.post('/devices/', async (req, res) => {
    const { name, count } = req.body
    try {
        const result = await pool.query(
            'INSERT INTO devices (name, count) VALUES ($1, $2) RETURNING *',
            [name, count]
        )
        res.json(result.rows[0])
    } catch (error) {
        console.error(error)
        res.status(500).send('Server Error')
    }
})

// Increment device count
app.put('/devices/:id/increment', async (req, res) => {
    const { id } = req.params
    try {
        const result = await pool.query(
            'UPDATE devices SET count = count + 1 WHERE id = $1 RETURNING *',
            [id]
        )
        res.json(result.rows[0])
    } catch (error) {
        console.error(error)
        res.status(500).send('Server Error')
    }
})

// Decrement device count
app.put('/devices/:id/decrement', async (req, res) => {
    const { id } = req.params
    try {
        const result = await pool.query(
            'UPDATE devices SET count = count - 1 WHERE id = $1 AND count > 0 RETURNING *',
            [id]
        )
        res.json(result.rows[0])
    } catch (error) {
        console.error(error)
        res.status(500).send('Server Error')
    }
})

// Delete a device
app.delete('/devices/:id', async (req, res) => {
    const { id } = req.params
    try {
        await pool.query('DELETE FROM devices WHERE id = $1', [id])
        res.sendStatus(204)
    } catch (error) {
        console.error(error)
        res.status(500).send('Server Error')
    }
})
