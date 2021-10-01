const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const { customStatusError } = require('./functions')

dotenv.config()

process.env.TOKEN_SECRET

/**
 * @function authenticateToken
 * @param {*} req express's request object, used to pass req.headers.authorization to make the token available
 * @param {*} res express's response object, used to send a response in the middleware incase of authentication failure
 * @param {*} next call next to call the next middleware/function
 * @return {object} it attaches an object to 'res.locals', it currently has { email, role, userID, name }
 * @description a middleware that takes the request header's authorization field's token (if it exits) and
 * verifies it. if verification fails the middleware returns a 403 status code response; and it won't call 'next()' so
 * the route that called this middleware function won't execute.
 * if verification succeeds the middleware attaches an object to 'res.locals' called 'userInfo', and it calls 'next()'
 * to proceed to continue the code execution in the route that called this middleware.
 */

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    console.log('Authenticating token...')
    if (token === null) return res.sendStatus(401).json('Token was null')
    jwt.verify(token, process.env.TOKEN_SECRET, function (err, decoded) {
        if (err) {
            console.error('AN ERROR OCCURRED WHEN VERIFYING TOKEN: ', err)
            return res.status(403).json('USER AUTHENTICATION failed')
        } else {
            res.locals.userInfo = {
                email: decoded.email,
                role: decoded.role,
                userID: decoded.userID,
                name: decoded.name,
            }
            next()
        }
    })
}

/**
 * @function verifyReqBodyObjValuesNotEmpty
 * @param {*} req
 * @param {*} res 
 * @param {*} next
 * @return {object} it attaches an object to 'res.locals', it currently has { email, role, userID, name }
 * @description a middleware that checks if req.body has empty values, trims the string from white spaces and checks if
 * the string is empty, if it is, 
 */

const verifyReqBodyObjValuesNotEmpty = (req, res, next) => {
    // arrIndex is the loop's index below at reqBodyArr,
    const findObjKeyAndRtrnErrorString = (arrIndex) => {
        // declare index variable, initialize it to 0
        let i = 0
        for (const key in req.body) {
            if (req.body.hasOwnProperty(key)) {
                // if the index equals the array index
                if (i === arrIndex)
                    // return the error string
                    return `key ${key} at req.body was empty`
                // else increment i and loop again
                i++
            }
        }
    }
    //Map object values to array
    const reqBodyArr = Object.values(req.body)
    // loop over it
    for (let i = 0; i < reqBodyArr.length; i++) {
        // I need to check if its a string first because string.trim() throws an error if it hits a number
        if (typeof reqBodyArr[i] === 'string') {
            // if one of the array (object values) is empty
            if (reqBodyArr[i].trim() === '') {
                //find the object's key according to the above index 'i', get the key's name, and return it
                const errorStr = findObjKeyAndRtrnErrorString(i)
                return customStatusError(
                    errorStr,
                    res,
                    403,
                    'One-some-all of the submitted values were empty'
                )
            }
        }
    }
    next()
}

// This middleware checks the PASSWORD field in REQUEST.BODY and verifies it does not contain any whitespace
const verifyReqBodyPasswordNoWhiteSpace = (req, res, next) => {
    const errorStr =
        'verifyReqBodyPasswordNoWhiteSpace() Password field in req.body contains an empty space at' +
        __dirname
    const { password } = req.body
    const re = /\s/
    if (re.test(password))
        return customStatusError(
            errorStr,
            res,
            403,
            'Your password must not contain an empty string'
        )
    next()
}

// This middleware checks the ALL fields in REQUEST.BODY and verifies it does not contain any whitespace
const verifyReqBodyObjNoWhiteSpace = (req, res, next) => {
    const errorStr =
        'verifyReqBodyObjNoWhiteSpace() req.body object values must not contain an empty space at' +
        __dirname
    const reqBodyArr = Object.values(req.body)
    const re = /\s/
    for (let i = 0; i < reqBodyArr.length; i++) {
        if (re.test(reqBodyArr[i]))
            return customStatusError(
                errorStr,
                res,
                403,
                'Your input must not contain an empty string'
            )
    }
    next()
}

module.exports = {
    authenticateToken,
    verifyReqBodyObjValuesNotEmpty,
    verifyReqBodyPasswordNoWhiteSpace,
    verifyReqBodyObjNoWhiteSpace,
}
