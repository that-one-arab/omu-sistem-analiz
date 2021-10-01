const pool = require('../../database/')
const { status500Error, customStatusError } = require('../../helpers/functions')

/**
 * @param {Object} req express request object, used to receive req.body
 * @param {Object} res express response object, used to send an early response with failed status
 * @param {Object} next express next, call next to continue code execution to the next function/middleware
 * @returns {Void} calls next.
 * @description 
 */
const verifyRegisterRoute = async (req, res, next) => {
    // Predefine the possible errors that might occur during input verification
    const reqBodyFailedVerification = 'Request body did not pass verification'
    const emailExistsInDB =
        'Request body email or username already exists in email'
    const unverifiedInput = () =>
        customStatusError(
            reqBodyFailedVerification,
            res,
            403,
            'Your input verifications failed to pass'
        )
    const userAlreadyExists = () =>
        customStatusError(emailExistsInDB, res, 406, 'This user already exists')
    // Start verification process
    const { username, password, dealerName, email } = req.body
    try {
        if (!username || !password || !dealerName || !email)
            if (
                username === '' ||
                password === '' ||
                dealerName === '' ||
                email === ''
            )
                return unverifiedInput()
        // verify the email
        const re =
            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        if (re.test(email) === false) return unverifiedInput()
        // check if email exists
        const emailQuery = await pool.query(
            'SELECT email, username FROM login WHERE email = $1 OR username = $2',
            [email, username]
        )
        if (emailQuery.rows.length !== 0) return userAlreadyExists()
        next()
    } catch (err) {
        return status500Error(
            err,
            res,
            'server error when attempting to register user'
        )
    }
}

module.exports = {
    verifyRegisterRoute,
}
