const express = require('express')
const path = require('path')
const bcrypt = require('bcrypt')
const pool = require('../../database/index')
const {
    authenticateToken,
    verifyReqBodyPasswordNoWhiteSpace,
} = require('../../helpers/middleware')

const { verifyLoginCredentials, generateAccessToken } = require('./functions')

const { verifyRegisterRoute } = require('./middleware')

const { customStatusError, status500Error } = require('../../helpers/functions')

const app = (module.exports = express())

app.use(
    express.static(
        path.join(
            __dirname + '/../../../views/resetpassword/enternewpass/build'
        )
    )
)
/**
 * @returns {Object} returns an object containing user information: { token, userRole, name, balance, assigned_area }
 * @description this route handles user login, the verifyLoginCredentials middleware handles the information received
 * from request body, process it. on failure the middleware returns an early 400 response, on success the middleware
 * attaches an object to res.locals, where this function takes that object and returns a response with that object.
 * @todo change userRole key to role, to maintain same naming
 */

app.post('/login', verifyLoginCredentials, async (req, res) => {
    try {
        const { email, role, userID, name, balance, assigned_area } =
            res.locals.userInfo
        const token = generateAccessToken({
            role,
            userID,
            name,
            balance,
            email,
        })
        return res.status(200).json({
            token: token,
            userRole: role,
            name,
            balance,
            assigned_area,
        })
    } catch (error) {
        console.error(error)
    }
})

/**
 * @returns {Object} returns an object that has user information properties
 * @description this is the route that verifies the user token. and returns user information object as json, except
 * that the returned object has updated user information, since that information is freshly fetched from the database.
 * it returns 401 if user's active state in the database is false (meaning he got deactivated by an SDC)
 */
app.get('/validate-token', authenticateToken, async (req, res) => {
    try {
        // Get user data where email =
        const dbUserTable = await pool.query(
            'SELECT email, role, balance, assigned_area, name, active FROM login WHERE email = $1',
            [res.locals.userInfo.email]
        )
        // return a 401 if user got deactivated
        if (dbUserTable.rows[0] === false)
            return customStatusError(
                'User with email ' + email + ' was deactivated',
                res,
                401,
                'You have been deactivated please contact administration'
            )
        // else return user information
        return res.status(200).json(dbUserTable.rows[0])
    } catch (error) {
        return status500Error(error, res, 'Could not authenticate')
    }
})

app.post(
    '/register',
    verifyRegisterRoute,
    verifyReqBodyPasswordNoWhiteSpace,
    async (req, res) => {
        try {
            const { username, password, dealerName, email } = req.body
            // Hash user password
            const hash = await bcrypt.hash(password, 10)

            // insert user record into login table
            await pool.query(
                "INSERT INTO login(username, hash, role, active, register_date, email, name, assigned_area) VALUES($1, $2, 'dealer', true, CURRENT_DATE, $3, $4, 'ilkadim') RETURNING email",
                [username, hash, email, dealerName]
            )

            return res.status(200).json('User registered successfully')
        } catch (err) {
            return status500Error(
                err,
                res,
                'server error when attempting to register user'
            )
        }
    }
)
