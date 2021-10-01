const bcrypt = require('bcrypt')
const pool = require('../../database')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const { status500Error } = require('../../helpers/functions.js')

dotenv.config()
process.env.TOKEN_SECRET

const verifyLoginCredentials = async (req, res, next) => {
    const clientEmail = req.body.email
    const clientPassword = req.body.password
    try {
        // VERIFY BEGIN
        if (clientEmail === '' || clientPassword === '')
            return res
                .status(403)
                .json('one of or both of the submitted fields were empty')
        const userQuery = await pool.query(
            'SELECT email, hash, role, user_id, active, name, assigned_area, balance FROM login WHERE email = $1',
            [clientEmail]
        )
        if (!userQuery.rows[0])
            return res.status(403).json('email or password does not match')
        const {
            email,
            hash,
            role,
            user_id,
            active,
            name,
            assigned_area,
            balance,
        } = userQuery.rows[0]
        if (!active)
            return res
                .status(406)
                .json(
                    'Your account has been deactivated, please contact administration'
                )
        const hashResult = await bcrypt.compare(clientPassword, hash)
        if (!hashResult)
            return res.status(403).json('email or password does not match')
        // VERIFY END
        res.locals.userInfo = {
            email,
            role,
            userID: user_id,
            name,
            assigned_area,
            balance,
        }
        next()
    } catch (err) {
        return status500Error(
            err,
            res,
            'server error, failed to process your login information'
        )
    }
}

const generateAccessToken = (payload) => {
    return jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: 180000 })
}

module.exports = {
    generateAccessToken,
    verifyLoginCredentials,
}
