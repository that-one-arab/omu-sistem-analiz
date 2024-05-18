const express = require('express')
const pool = require('../database/index')

const app = (module.exports = express())

// Create a daily report
app.post('/report', async (req, res) => {
    const { date, transactions, descriptions } = req.body

    try {
        await pool.query('BEGIN')
        await pool.query('INSERT INTO daily_reports (date) VALUES ($1)', [date])
        await pool.query(
            'INSERT INTO kasa_transactions (date, sanalPara, cihazSatisi, aksesuarSatisi, digerGelirler, digerGiderler) VALUES ($1, $2, $3, $4, $5, $6)',
            [
                date,
                transactions.sanalpara,
                transactions.cihazsatisi,
                transactions.aksesuarsatisi,
                transactions.digergelirler,
                transactions.digergiderler,
            ]
        )
        await pool.query(
            'INSERT INTO descriptions (date, sanalParaDesc, cihazSatisiDesc, aksesuarSatisiDesc, digerGelirlerDesc, digerGiderlerDesc) VALUES ($1, $2, $3, $4, $5, $6)',
            [
                date,
                descriptions.sanalparadesc,
                descriptions.cihazsatisidesc,
                descriptions.aksesuarsatisidesc,
                descriptions.digergelirlerdesc,
                descriptions.digergiderlerdesc,
            ]
        )
        await pool.query('COMMIT')
        res.status(201).send('Report created successfully')
    } catch (error) {
        await pool.query('ROLLBACK')
        res.status(500).send('Error creating report: ' + error.message)
    }
})

// Read a daily report
app.get('/report/:date', async (req, res) => {
    const { date } = req.params

    try {
        const reportResult = await pool.query(
            'SELECT * FROM daily_reports WHERE date = $1',
            [date]
        )
        const transactionsResult = await pool.query(
            'SELECT * FROM kasa_transactions WHERE date = $1',
            [date]
        )
        const descriptionsResult = await pool.query(
            'SELECT * FROM descriptions WHERE date = $1',
            [date]
        )

        if (reportResult.rows.length === 0) {
            return res.status(404).send('Report not found')
        }

        const report = {
            date: reportResult.rows[0].date,
            transactions: transactionsResult.rows[0],
            descriptions: descriptionsResult.rows[0],
        }

        res.status(200).json(report)
    } catch (error) {
        res.status(500).send('Error reading report: ' + error.message)
    }
})

// Delete a daily report
app.delete('/report/:date', async (req, res) => {
    const { date } = req.params

    try {
        const deleteResult = await pool.query(
            'DELETE FROM daily_reports WHERE date = $1',
            [date]
        )

        if (deleteResult.rowCount === 0) {
            return res.status(404).send('Report not found')
        }

        res.status(200).send('Report deleted successfully')
    } catch (error) {
        res.status(500).send('Error deleting report: ' + error.message)
    }
})
