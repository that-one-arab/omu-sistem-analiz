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

/** Code will be re-implemented. comment out for now */
// app.post(
//     '/register',
//     verifyRegisterRoute,
//     verifyReqBodyPasswordNoWhiteSpace,
//     async (req, res) => {
//         try {
//             const { username, password, dealerName, email } = req.body
//             // Generate a unique ID as email verification param
//             const uniqueID = uniqid()
//             // Hash user password
//             const hash = await bcrypt.hash(password, 10)
//             // Register table is a temporary table that stores users who haven't verified their email yet. Store the request body information
//             // And the unique ID for later email verification
//             await pool.query(
//                 'INSERT INTO register(username, password, email, verify_email_id, date, dealer_name) VALUES ($1, $2, $3, $4, CURRENT_DATE, $5)',
//                 [username, hash, email, uniqueID, dealerName]
//             )
//             // After inserting the new record, render the Verify Email HTML template, it takes the unique ID generated eariler as in argument
//             // And it uses that unique ID to render a link with that unique ID as the route's (link's) parameter. EG: http://localhost:8080/verifymail/[UNIQUE ID]
//             app.render(
//                 __dirname + '/../../../views/emailverification/verifyemail.ejs',
//                 {
//                     verifyEmailID:
//                         'http://localhost:8080/verifymail/' + uniqueID,
//                 },
//                 (err, html) => {
//                     if (err)
//                         return status500Error(
//                             err,
//                             res,
//                             'server error when attempting to register user'
//                         )
//                     // insert the HTML into mailgun mailing options
//                     const emailData = {
//                         from: '<info@obexport.com>',
//                         to: email,
//                         subject: 'Mail adresinizi onaylayın',
//                         html: html,
//                     }
//                     // Send the email!
//                     mailgun.messages().send(emailData, (err, body) => {
//                         if (err) {
//                             return status500Error(
//                                 err,
//                                 res,
//                                 'server error when attempting to register user'
//                             )
//                         }
//                         console.log(body)
//                         res.status(200).json(
//                             "Register application is successful, awaiting client verification through client's email"
//                         )
//                     })
//                 }
//             )
//         } catch (err) {
//             return status500Error(
//                 err,
//                 res,
//                 'server error when attempting to register user'
//             )
//         }
//     }
// )

// // this code handles verifiying the email that was inserted in the database, and sent to the client's email. It takes the
// // special ID generated in register route, and placed in the email template URL button as the main argument. Then proceeds
// // to verify it. If verifications pass, the user's records gets inserted in the login table, which allows him to log in to
// // the application
// app.get('/verifymail/:emailID', async (req, res) => {
//     const { emailID } = req.params
//     const noEmailIDinDB =
//         'The email verification ID queried returned empty, either expired or does not exist'
//     // Following lines are a database transaction
//     const client = await pool.connect()
//     try {
//         //verify the emailID that exists in the database.
//         const emailIDQuery = await client.query(
//             'SELECT * FROM register WHERE verify_email_id = $1',
//             [emailID]
//         )
//         if (emailIDQuery.rows.length === 0)
//             return customStatusError(
//                 noEmailIDinDB,
//                 res,
//                 403,
//                 "Your email verification ID has expired or doesn't exist"
//             )
//         const { username, password, email, dealer_name } = emailIDQuery.rows[0]
//         const userID = uniqid()
//         await client.query('BEGIN')
//         //insert user record into login table
//         const insertUserQuery = await client.query(
//             "INSERT INTO login(username, hash, role, active, register_date, user_id, email, name) VALUES($1, $2, 'dealer', true, CURRENT_DATE, $3, $4, $5) RETURNING email",
//             [username, password, userID, email, dealer_name]
//         )
//         // delete user register record (email ID) from register table
//         await client.query('DELETE FROM register WHERE email = $1', [
//             insertUserQuery.rows[0].email,
//         ])
//         await client.query('COMMIT')
//         // return a template HTML that tells the user his verification was a success, and a link to take them to the login page
//         return res.render(
//             __dirname + '/../../../views/emailverification/emailverified.ejs',
//             { loginPage: 'http://localhost:3000' }
//         )
//     } catch (err) {
//         await client.query('ROLLBACK')
//         return status500Error(
//             err,
//             res,
//             'An error occurred while attempting to verify your email authentication ID'
//         )
//     } finally {
//         client.release()
//     }
// })

// // This code handles resetting the client's password. it takes the client's email as the main
// // argument. If the client's email exists in the database, it inserts a reset token into the
// // database, and sends the same reset token to the client's email. The token expires in 1 hour
// // If the client's email doesn't exist, it sends a 200 status anyways.
// app.get('/resetpassword', async (req, res) => {
//     const { email } = req.query
//     const doesPrevResetToken = await pool.query(
//         'SELECT * FROM tempidstore WHERE pass_reset_for = $1',
//         [email]
//     )
//     // if client has alreacy submitted a reset request, invalidate the previous token
//     if (doesPrevResetToken.rows !== 0)
//         await pool.query(
//             'UPDATE tempidstore SET is_valid = false WHERE pass_reset_for = $1',
//             [email]
//         )
//     const emailIDQuery = await pool.query(
//         'SELECT * FROM login WHERE email = $1',
//         [email]
//     )
//     // if request query email does not exist in the database
//     if (emailIDQuery.rows.length === 0)
//         // I'm returning a fake response to protect a potential attacker from finding a user's email
//         // in reality the query failed
//         return res
//             .status(200)
//             .json(
//                 'Your account password reset query was successful, check incoming mail'
//             )
//     const passResetToken = jwt.sign(
//         { for: email, date: new Date() },
//         process.env.TOKEN_SECRET,
//         { expiresIn: 3600 }
//     )
//     // insert token into database
//     await pool.query(
//         'INSERT INTO tempidstore VALUES($1, CURRENT_DATE, true, $2)',
//         [passResetToken, email]
//     )
//     // send email with resetPassword HTML template that contains /resetpassword/:passResetToken link
//     app.render(
//         __dirname + '/../../../views/resetpassword/resetPassword.ejs',
//         {
//             resetPassPage:
//                 'http://localhost:8080/resetpassword/' + passResetToken,
//         },
//         (err, html) => {
//             if (err)
//                 return status500Error(
//                     err,
//                     res,
//                     'An error occurred during password reset'
//                 )
//             const emailData = {
//                 from: 'İletişim<info@obexport.com>',
//                 to: email,
//                 subject: 'Şifre Resetleme',
//                 html: html,
//             }
//             mailgun.messages().send(emailData, (err, body) => {
//                 if (err)
//                     return status500Error(
//                         err,
//                         res,
//                         'An error occurred during password reset'
//                     )
//                 console.log(body)
//                 res.status(200).json(
//                     'Your account password reset query was successful, check incoming mail'
//                 )
//             })
//         }
//     )
// })

// // This code runs when the client clicks the link sent to his email in the EMAIL template
// // that was sent by the /resetpassword route. If the token is valid, it renders a React
// // build that allows the user to reset his password. If the token is invalid, it renders
// // an HTML that tells the user the link was expired
// app.get('/resetpassword/:passResetToken', async (req, res) => {
//     const { passResetToken } = req.params
//     const sendLinkExpiredHTML = () =>
//         res.sendFile(
//             path.join(
//                 __dirname +
//                     '/../../../views/resetpassword/passresetlinkexpired/index.html'
//             )
//         )
//     const sendPassResetBuild = () =>
//         res.sendFile(
//             path.join(
//                 __dirname +
//                     '/../../../views/resetpassword/enternewpass/build/index.html'
//             )
//         )
//     if (passResetToken === null) {
//         console.log('token was null')
//         return sendLinkExpiredHTML()
//     }
//     const isTokenValid = await pool.query(
//         'SELECT * FROM tempidstore WHERE pass_reset_id = $1',
//         [passResetToken]
//     )
//     if (!isTokenValid.rows[0]) {
//         console.log('token does not exist')
//         return sendLinkExpiredHTML()
//     }
//     if (isTokenValid.rows[0].is_valid === false) return sendLinkExpiredHTML()

//     jwt.verify(
//         passResetToken,
//         process.env.TOKEN_SECRET,
//         async function (err, decoded) {
//             if (err)
//                 return customStatusError(
//                     err,
//                     res,
//                     403,
//                     'Token authentication failed'
//                 )
//             else {
//                 console.log('sending build')
//                 return sendPassResetBuild()
//             }
//         }
//     )
// })

// // This code handles the password reset procedure initialized by the previous GET route that
// // sent the React build. It takes the original sent token as it's main argument. If validations
// // pass, previous/all client's tokens get's deleted, and his database login hash get's updated
// // according to his new password.
// app.put('/resetpassword/:passResetToken', async (req, res) => {
//     const { passResetToken } = req.params
//     const { password } = req.body
//     if (passResetToken === null)
//         return res.sendStatus(401).json('Token was null')
//     //check the validity of the token
//     const isTokenValid = await pool.query(
//         'SELECT * FROM tempidstore WHERE pass_reset_id = $1',
//         [passResetToken]
//     )
//     // if the request token does exist in DB AND the request token's is_valid status is true, continue...
//     if (isTokenValid.rows[0] && isTokenValid.rows[0].is_valid === true) {
//         //verify the token...
//         jwt.verify(
//             passResetToken,
//             process.env.TOKEN_SECRET,
//             async function (err, decoded) {
//                 if (err)
//                     return customStatusError(
//                         err,
//                         res,
//                         403,
//                         'password reset ID verification FAILED'
//                     )
//                 else {
//                     // the email field embedded in the token when it was first created
//                     const email = decoded.for
//                     //hash the new password
//                     const hash = await bcrypt.hash(password, 10)
//                     // await client to start transaction
//                     const client = await pool.connect()
//                     try {
//                         await client.query('BEGIN')
//                         // delete the password reset ID (potentially all of them that fall under the same email) from table
//                         await client.query(
//                             'DELETE FROM tempidstore WHERE pass_reset_for = $1',
//                             [email]
//                         )
//                         // update the new hash (password) in the login table
//                         await client.query(
//                             'UPDATE login SET hash = $1 WHERE email = $2',
//                             [hash, email]
//                         )

//                         await client.query('COMMIT')
//                         return res
//                             .status(200)
//                             .json('Password reset successfull.')
//                     } catch (err) {
//                         await client.query('ROLLBACK')
//                         return status500Error(
//                             err,
//                             res,
//                             'An error occurred while resetting your password'
//                         )
//                     } finally {
//                         client.release()
//                     }
//                 }
//             }
//         )
//     } else {
//         return res.status(403).json('Token has expired')
//     }
// })
