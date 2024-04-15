const express = require('express')
const pool = require('../../database')
const {
    customStatusError,
    status500Error,
    verifyUserAndReturnInfo,
} = require('../../helpers/functions')
const {
    authenticateToken,
    verifyReqBodyObjValuesNotEmpty,
    verifyReqBodyObjNoWhiteSpace,
} = require('../../helpers/middleware')
const {
    verifyReqObjExpectedObjKeys,
    verifyInputNotEmptyFunc,
} = require('../../helpers/functions')
const {
    verifyDateNotOlderThanCurnt,
    verifyGoalDoesNotExist,
} = require('./functions')

const app = (module.exports = express())

// **** NOTES **** //
// The below routes use the same verification statements, resulting in atleast 4 repetitions in 4 routes
// I could join them in a single function
// **** NOTES **** //

// This route is responsible for toggling a user's active status
app.put('/user/active/:userID', authenticateToken, async (req, res) => {
    const userInfo = res.locals.userInfo
    // VERIFICATION BEGIN
    if (userInfo.role !== 'sales_assistant_chef')
        return customStatusError(
            'unauthorized access, no sales_assistant_chef role /user/active/:userID at' +
                __dirname,
            res,
            401,
            'Unauthorized route'
        )
    const { userID } = req.params
    try {
        const requestedUserInfo = await verifyUserAndReturnInfo(userID)
        // check if returned user information object from verifyUserAndReturnInfo query is empty
        if (
            Object.keys(requestedUserInfo).length === 0 &&
            requestedUserInfo.constructor === Object
        ) {
            const errorUserDoesNotExist =
                "user with ID '" + userID + "' does not exist in database"
            return customStatusError(
                errorUserDoesNotExist,
                res,
                406,
                'This user does not exist'
            )
        }
        const requestedUserRole = requestedUserInfo.role
        // Requester cannot update sales_assistant_chef or admin.
        if (
            requestedUserRole === 'sales_assistant_chef' ||
            requestedUserRole === 'admin'
        ) {
            const errorUnauthorizedUpdate =
                "user ID '" +
                userID +
                "' who is a '" +
                requestedUserRole +
                "' attempted to get updated by requester, unauthorized! at " +
                __dirname
            return customStatusError(
                errorUnauthorizedUpdate,
                res,
                400,
                'You are not authorized to make this update'
            )
        }
        // VERIFICATION END
        await pool.query(
            'UPDATE login SET active = NOT active WHERE user_id = $1',
            [userID]
        )
        res.status(200).json('User status update was a success')
    } catch (err) {
        return status500Error(
            err,
            res,
            'server error occurred while attempting to PUT user'
        )
    }
})

// This route is responsible for assigning a user to an area
app.put('/user/assign/area', authenticateToken, async (req, res) => {
    const { userInfo } = res.locals
    // VERIFICATION BEGIN
    if (userInfo.role !== 'sales_assistant_chef')
        return customStatusError(
            'unauthorized access, no sales_assistant_chef role /user/assign/area at' +
                __dirname,
            res,
            401,
            'Unauthorized route'
        )
    const isReqObjVerified = verifyReqObjExpectedObjKeys(
        ['userID', 'toArea'],
        req.query
    )
    if (isReqObjVerified.ok === false)
        return customStatusError(
            isReqObjVerified.error,
            res,
            isReqObjVerified.statusCode,
            isReqObjVerified.resString
        )
    const isInputEmpty = verifyInputNotEmptyFunc(res.query)
    if (isInputEmpty.ok === false)
        return customStatusError(
            isInputEmpty.error,
            res,
            isInputEmpty.statusCode,
            isInputEmpty.resString
        )
    const { userID, toArea } = req.query
    try {
        const requestedUserInfo = await verifyUserAndReturnInfo(userID)
        // check if returned user information object from verifyUserAndReturnInfo query is empty
        if (
            Object.keys(requestedUserInfo).length === 0 &&
            requestedUserInfo.constructor === Object
        ) {
            const errorUserDoesNotExist =
                "user with ID '" + userID + "' does not exist in database"
            return customStatusError(
                errorUserDoesNotExist,
                res,
                406,
                'This user does not exist'
            )
        }
        const requestedUserRole = requestedUserInfo.role
        // Requester cannot update sales_assistant_chef or admin.
        if (
            requestedUserRole === 'sales_assistant_chef' ||
            requestedUserRole === 'admin'
        ) {
            const errorUnauthorizedUpdate =
                "user ID '" +
                userID +
                "' who is a '" +
                requestedUserRole +
                "' attempted to get updated by requester, unauthorized! at " +
                __dirname
            return customStatusError(
                errorUnauthorizedUpdate,
                res,
                400,
                'You are not authorized to make this update'
            )
        }
        // VERIFICATION END
        else {
            await pool.query(
                'UPDATE login SET assigned_area = $1 WHERE user_id = $2',
                [toArea, userID]
            )
            res.status(200).json('User area assignment update was a success')
        }
    } catch (err) {
        return status500Error(
            err,
            res,
            'server error occurred while attempting to PUT user'
        )
    }
})

// This route is responsible for assigning a user to a role
app.put('/user/assign/role', authenticateToken, async (req, res) => {
    // selectable roles are hardcoded
    const { userInfo } = res.locals
    const selectableRoles = ['dealer', 'sales_assistant']
    // VERIFICATION BEGINS
    if (userInfo.role !== 'sales_assistant_chef')
        return customStatusError(
            'unauthorized access, no sales_assistant_chef role /user/assign/role at' +
                __dirname,
            res,
            401,
            'Unauthorized route'
        )
    const { userID, toRole } = req.query
    // check if toRole request query input exist as element in selectableRoles array
    if (selectableRoles.includes(toRole) === false) {
        const errorStr =
            "expected input in array '" +
            selectableRoles +
            "' instead got " +
            toRole
        return customStatusError(errorStr, res, 406, 'Unexpected input')
    }
    try {
        const requestedUserInfo = await verifyUserAndReturnInfo(userID)
        // check if returned user information object from verifyUserAndReturnInfo query is empty
        if (
            Object.keys(requestedUserInfo).length === 0 &&
            requestedUserInfo.constructor === Object
        ) {
            const errorUserDoesNotExist =
                "user with ID '" + userID + "' does not exist in database"
            return customStatusError(
                errorUserDoesNotExist,
                res,
                406,
                'This user does not exist'
            )
        }
        const requestedUserRole = requestedUserInfo.role
        // Requester cannot update sales_assistant_chef or admin.
        if (
            requestedUserRole === 'sales_assistant_chef' ||
            requestedUserRole === 'admin'
        ) {
            const errorUnauthorizedUpdate =
                "user ID '" +
                userID +
                "' who is a '" +
                requestedUserRole +
                "' attempted to get updated by requester, unauthorized! at " +
                __dirname
            return customStatusError(
                errorUnauthorizedUpdate,
                res,
                400,
                'You are not authorized to make this update'
            )
        }
        // VERIFICATION ENDS
        await pool.query('UPDATE login SET role = $1 WHERE user_id = $2', [
            toRole,
            userID,
        ])
        res.status(200).json('User status update was a success')
    } catch (err) {
        return status500Error(
            err,
            res,
            'server error occurred while attempting to PUT user'
        )
    }
})

app.post(
    '/goal',
    authenticateToken,
    verifyReqBodyObjValuesNotEmpty,
    verifyReqBodyObjNoWhiteSpace,
    async (req, res) => {
        const { userInfo } = res.locals

        // VERIFICATION BEGINS
        const isReqObjVerified = verifyReqObjExpectedObjKeys(
            ['userID', 'date', 'service', 'goal'],
            req.body,
            res
        )
        if (isReqObjVerified.ok === false)
            return customStatusError(
                isReqObjVerified.error,
                res,
                isReqObjVerified.statusCode,
                isReqObjVerified.resString
            )
        const { userID, date, service, goal } = req.body
        if (userInfo.role !== 'sales_assistant_chef')
            return customStatusError(
                'unauthorized access, no sales_assistant_chef role /goal at' +
                    __dirname,
                res,
                401,
                'Unauthorized route'
            )
        try {
            const requestedUserInfo = await verifyUserAndReturnInfo(userID)
            // check if returned user information object from verifyUserAndReturnInfo query is empty
            if (
                Object.keys(requestedUserInfo).length === 0 &&
                requestedUserInfo.constructor === Object
            ) {
                const errorUserDoesNotExist =
                    "user with ID '" + userID + "' does not exist in database"
                return customStatusError(
                    errorUserDoesNotExist,
                    res,
                    406,
                    'This user does not exist'
                )
            }
            const requestedUserRole = requestedUserInfo.role
            // Requester cannot update sales_assistant_chef or admin.
            if (
                requestedUserRole === 'sales_assistant_chef' ||
                requestedUserRole === 'admin'
            ) {
                const errorUnauthorizedUpdate =
                    "user ID '" +
                    userID +
                    "' who is a '" +
                    requestedUserRole +
                    "' attempted to get updated by requester, unauthorized! at " +
                    __dirname
                return customStatusError(
                    errorUnauthorizedUpdate,
                    res,
                    400,
                    'You are not authorized to make this update'
                )
            }

            // get services and store them in array
            const servicesStatement =
                'SELECT * FROM services WHERE active = true'
            const servicesQuery = await pool.query(servicesStatement)
            const servicesArr = servicesQuery.rows.map((obj) => obj.service_id)
            // check if 'service' value from req.body exists in services array, if false return 406
            if (servicesArr.includes(Number(service)) === false) {
                const errorStrUnexpectedInput =
                    "expected input in array '" +
                    servicesArr +
                    "' got " +
                    service
                return customStatusError(
                    errorStrUnexpectedInput,
                    res,
                    406,
                    'Unexpected input'
                )
            }
            // I'm verifying if the input date is older than the present date, the func below returns an object with keys {ok, error, verifiedDate} and I'm basing my condition on that
            const isDateOlderThanPresent = verifyDateNotOlderThanCurnt(date)
            if (isDateOlderThanPresent.ok === false)
                return customStatusError(
                    isDateOlderThanPresent.error,
                    res,
                    406,
                    'inputted date is old UNACCEPTED INPUT'
                )
            // doing something similar here, verifiyng if the goal with the same date, service and userID values already exists
            const doesGoalAlreadyExist = await verifyGoalDoesNotExist(
                date,
                service,
                userID
            )
            if (doesGoalAlreadyExist.ok === false)
                return customStatusError(
                    doesGoalAlreadyExist.error,
                    doesGoalAlreadyExist.statusCode,
                    406,
                    'This goal already exists'
                )
            // This verification function returns a date value called verifiedDate, that has the normal year month input, but it resets day to 01 EG: 2021-08-01 OR 2022-11-01
            const { verifiedDate } = isDateOlderThanPresent
            // VERIFICATION ENDS
            try {
                const queryString =
                    'INSERT INTO goals(service_id, goal, for_date, for_user_id, submit_date, done, success) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, 0, false)'
                await pool.query(queryString, [
                    service,
                    goal,
                    verifiedDate,
                    userID,
                ])
            } catch (error) {
                return status500Error(error, res, 'Could not insert goal')
            }

            res.status(200).json('Your goal was added successfully!')
        } catch (err) {
            return status500Error(
                err,
                res,
                'server error occurred while attempting to PUT user'
            )
        }
    }
)

app.post(
    '/service',
    authenticateToken,
    verifyReqBodyObjValuesNotEmpty,
    async (req, res) => {
        const { userInfo } = res.locals
        // VERIFICATION BEGINS
        const isReqObjVerified = verifyReqObjExpectedObjKeys(
            ['newServiceName', 'newServiceDescription', 'isProfitable'],
            req.body,
            res
        )
        if (isReqObjVerified.ok === false)
            return customStatusError(
                isReqObjVerified.error,
                res,
                isReqObjVerified.statusCode,
                isReqObjVerified.resString
            )
        const { newServiceName, newServiceDescription, isProfitable } = req.body
        if (userInfo.role !== 'sales_assistant_chef')
            return customStatusError(
                'unauthorized access, no sales_assistant_chef role /service at' +
                    __dirname,
                res,
                401,
                'Unauthorized route'
            )
        try {
            // get services and store them in array to check if user's submitted service is not duplicate (The name column in db
            // already has a unique constraint but still having a custom error message would be usefull)
            const servicesStatement =
                'SELECT * FROM services WHERE active = true'
            const servicesQuery = await pool.query(servicesStatement)
            const servicesArr = servicesQuery.rows.map((obj) => obj.name)
            // check if 'service' value from req.body exists in services array, if true return 401
            if (servicesArr.includes(newServiceName) === true) {
                const errorStrUnexpectedInput =
                    "services array '" +
                    servicesArr +
                    "' already contains the value '" +
                    newServiceName +
                    "' submitted by requester"
                return customStatusError(
                    errorStrUnexpectedInput,
                    res,
                    406,
                    'Service already exists'
                )
            }
            // VERIFICATION ENDS
            const queryString =
                'INSERT INTO services(name, description, profitable, active) VALUES ($1, $2, $3, true)'
            await pool.query(queryString, [
                newServiceName,
                newServiceDescription,
                isProfitable,
            ])
            return res.status(200).json('Your service was added successfully!')
        } catch (err) {
            return status500Error(err, res, 'Could not insert service')
        }
    }
)

app.put('/service/name', authenticateToken, async (req, res) => {
    const { serviceID } = req.query
    const { newServiceName } = req.body
    const { userInfo } = res.locals

    // VERIFICATION BEGINS
    const isReqObjVerified = verifyReqObjExpectedObjKeys(
        ['newServiceName'],
        req.body,
        res
    )
    if (isReqObjVerified.ok === false)
        return customStatusError(
            isReqObjVerified.error,
            res,
            isReqObjVerified.statusCode,
            isReqObjVerified.resString
        )
    const isInputEmpty = verifyInputNotEmptyFunc(req.body)
    if (isInputEmpty.ok === false)
        return customStatusError(
            isInputEmpty.error,
            res,
            isInputEmpty.statusCode,
            isInputEmpty.resString
        )
    if (userInfo.role !== 'sales_assistant_chef')
        return customStatusError(
            'unauthorized access, no sales_assistant_chef role /service/name at' +
                __dirname,
            res,
            401,
            'Unauthorized route'
        )
    try {
        // get services and store them in array
        const servicesStatement = 'SELECT * FROM services WHERE service_id = $1'
        const servicesQuery = await pool.query(servicesStatement, [serviceID])
        // check if 'service' value exists in DB, else return 406
        if (servicesQuery.rowCount === 0) {
            const errorStrUnexpectedInput =
                "requester's requested service '" +
                serviceID +
                "' does not exist "
            return customStatusError(
                errorStrUnexpectedInput,
                res,
                406,
                'your requested service does not exist'
            )
        }
        if (newServiceName === servicesQuery.rows[0].name) {
            const errorStrSameName =
                "requested service name change '" +
                newServiceName +
                "' is no different than " +
                servicesQuery.rows[0].name
            return customStatusError(
                errorStrSameName,
                res,
                406,
                'Service name is already the same, no change required'
            )
        }
        // VERIFICATION ENDS
        const queryString =
            'UPDATE services SET name = $1 WHERE service_id = $2'
        await pool.query(queryString, [newServiceName, serviceID])
        res.status(200).json('Your service name was updated successfully')
    } catch (err) {
        return status500Error(
            err,
            res,
            'server error while PUTTING service name'
        )
    }
})

app.put('/service/description', authenticateToken, async (req, res) => {
    const { serviceID } = req.query
    const { newServiceDescription } = req.body
    const { userInfo } = res.locals

    // VERIFICATION BEGINS
    const isReqObjVerified = verifyReqObjExpectedObjKeys(
        ['newServiceDescription'],
        req.body,
        res
    )
    if (isReqObjVerified.ok === false)
        return customStatusError(
            isReqObjVerified.error,
            res,
            isReqObjVerified.statusCode,
            isReqObjVerified.resString
        )
    const isInputEmpty = verifyInputNotEmptyFunc(req.body)
    if (isInputEmpty.ok === false)
        return customStatusError(
            isInputEmpty.error,
            res,
            isInputEmpty.statusCode,
            isInputEmpty.resString
        )
    if (userInfo.role !== 'sales_assistant_chef')
        return customStatusError(
            'unauthorized access, no sales_assistant_chef role /service/description at' +
                __dirname,
            res,
            401,
            'Unauthorized route'
        )
    try {
        // get services and store them in array
        const servicesStatement = 'SELECT * FROM services WHERE service_id = $1'
        const servicesQuery = await pool.query(servicesStatement, [serviceID])
        // check if 'service' value exists in DB, else return 406
        if (servicesQuery.rowCount === 0) {
            const errorStrUnexpectedInput =
                "requester's requested service '" +
                serviceID +
                "' does not exist "
            return customStatusError(
                errorStrUnexpectedInput,
                res,
                406,
                'your requested service does not exist'
            )
        }
        if (newServiceDescription === servicesQuery.rows[0].description) {
            const errorStrSameName =
                "requested service name change '" +
                newServiceDescription +
                "' is no different than " +
                servicesQuery.rows[0].name
            return customStatusError(
                errorStrSameName,
                res,
                406,
                'Service name is already the same, no change required'
            )
        }
        // VERIFICATION ENDS
        const queryString =
            'UPDATE services SET description = $1 WHERE service_id = $2'
        await pool.query(queryString, [newServiceDescription, serviceID])
        res.status(200).json('Your service name was updated successfully')
    } catch (err) {
        return status500Error(
            err,
            res,
            'server error while PUTTING service name'
        )
    }
})

app.put('/service/active', authenticateToken, async (req, res) => {
    const { serviceID } = req.query
    const { userInfo } = res.locals

    // VERIFICATION BEGINS
    if (userInfo.role !== 'sales_assistant_chef')
        return customStatusError(
            'unauthorized access, no sales_assistant_chef role /service/active at' +
                __dirname,
            res,
            401,
            'Unauthorized route'
        )
    const isReqQueryValid = verifyReqObjExpectedObjKeys(
        ['serviceID'],
        req.query
    )
    if (isReqQueryValid.ok === false)
        return customStatusError(
            isReqQueryValid.error,
            res,
            isReqQueryValid.statusCode,
            isReqQueryValid.resString
        )
    const isInputNotEmpty = verifyInputNotEmptyFunc(req.query)
    if (isInputNotEmpty.ok === false)
        return customStatusError(
            isInputNotEmpty.error,
            res,
            isInputNotEmpty.statusCode,
            isInputNotEmpty.resString
        )
    const client = await pool.connect()
    try {
        await client.query('BEGIN')
        // get services and store them in array
        const servicesStatement = 'SELECT * FROM services WHERE service_id = $1'
        const servicesQuery = await pool.query(servicesStatement, [serviceID])
        // check if 'serviceID' value exists in DB, else return 406
        if (servicesQuery.rowCount === 0) {
            const errorStrUnexpectedInput =
                "requester's requested service ID '" +
                serviceID +
                "' does not exist "
            return customStatusError(
                errorStrUnexpectedInput,
                res,
                406,
                'your requested service ID does not exist'
            )
        }
        // VERIFICATION ENDS

        const deleteServicesQuery =
            'UPDATE services SET active = NOT active WHERE service_id = $1'
        await client.query(deleteServicesQuery, [serviceID])
        const deleteOffersQuery =
            'UPDATE offers SET active = NOT active WHERE service_id = $1'
        await client.query(deleteOffersQuery, [serviceID])

        await client.query('COMMIT')
        client.release()
        res.status(200).json(
            "Your service's active state was toggled successfully"
        )
    } catch (err) {
        await client.query('ROLLBACK')
        client.release
        return status500Error(
            err,
            res,
            'server error while PUTTING service active'
        )
    }
})

// // ***** the below route is inactive for now

// app.delete("/service", authenticateToken, async (req, res) => {
//   const { serviceID } = req.query
//   const { userInfo } = res.locals

//   // VERIFICATION BEGINS
//   if (userInfo.role !== "sales_assistant_chef")
//     return customStatusError("unauthorized access, no sales_assistant_chef role /service/active at"+__dirname, res, 401, "Unauthorized route")
//   const isReqQueryValid = verifyReqObjExpectedObjKeys(['serviceID'], req.query)
//   if (isReqQueryValid.ok === false)
//     return customStatusError(isReqQueryValid.error, res, isReqQueryValid.statusCode, isReqQueryValid.resString)
//   const isInputNotEmpty = verifyInputNotEmptyFunc(req.query)
//   if (isInputNotEmpty.ok === false)
//     return customStatusError(isInputNotEmpty.error, res, isInputNotEmpty.statusCode, isInputNotEmpty.resString)
//   const client = await pool.connect()
//   try {
//     await client.query("BEGIN")
//     // get services and store them in array
//     const servicesStatement = "SELECT * FROM services WHERE service_id = $1"
//     const servicesQuery = await pool.query(servicesStatement, [serviceID])
//     // check if 'serviceID' value exists in DB, else return 406
//     if (servicesQuery.rowCount === 0) {
//       const errorStrUnexpectedInput = "requester's requested service ID '" + serviceID + "' does not exist "
//       return customStatusError(errorStrUnexpectedInput, res, 406, "your requested service ID does not exist")
//     }
//     // VERIFICATION ENDS

//     const deleteServicesQuery = "DELETE FROM services WHERE service_id = $1"
//     await client.query(deleteServicesQuery, [serviceID])
//     const deleteOffersQuery = "DELETE FROM offers WHERE service_id = $1"
//     await client.query(deleteOffersQuery, [serviceID])

//     await client.query("COMMIT")
//     client.release()
//     res.status(200).json("Your service's active state was toggled successfully")
// } catch (err) {
//     await client.query("ROLLBACK")
//     client.release
//     return status500Error(err, res, "server error while PUTTING service active")
// }
// })

app.put(
    '/service/profitable',
    verifyReqBodyObjValuesNotEmpty,
    authenticateToken,
    async (req, res) => {
        const { service } = req.query
        const serviceEngName = service
        const { userInfo } = res.locals

        // VERIFICATION BEGINS
        if (userInfo.role !== 'sales_assistant_chef')
            return customStatusError(
                'unauthorized access, no sales_assistant_chef role /service/active at' +
                    __dirname,
                res,
                401,
                'Unauthorized route'
            )
        const isReqQueryValid = verifyReqObjExpectedObjKeys(
            ['service'],
            req.query
        )
        if (isReqQueryValid.ok === false)
            return customStatusError(
                isReqQueryValid.error,
                res,
                isReqQueryValid.statusCode,
                isReqQueryValid.resString
            )
        const isInputNotEmpty = verifyInputNotEmptyFunc(req.query)
        if (isInputNotEmpty.ok === false)
            return customStatusError(
                isInputNotEmpty.error,
                res,
                isInputNotEmpty.statusCode,
                isInputNotEmpty.resString
            )
        try {
            const servicesStatement =
                'SELECT * FROM services WHERE eng_equivalent = $1'
            const servicesQuery = await pool.query(servicesStatement, [
                serviceEngName,
            ])
            // check if 'service' value exists in DB, else return 406
            if (servicesQuery.rowCount === 0) {
                const errorStrUnexpectedInput =
                    "requester's requested service '" +
                    serviceEngName +
                    "' does not exist "
                return customStatusError(
                    errorStrUnexpectedInput,
                    res,
                    406,
                    'your requested service does not exist'
                )
            }
            // VERIFICATION ENDS
            const queryString =
                'UPDATE services SET profitable = NOT profitable WHERE eng_equivalent = $1'
            await pool.query(queryString, [serviceEngName])
            res.status(200).json(
                "Your service's profitable state was toggled successfully"
            )
        } catch (err) {
            return status500Error(
                err,
                res,
                'server error while PUTTING service active'
            )
        }
    }
)

app.post(
    '/offer',
    authenticateToken,
    verifyReqBodyObjValuesNotEmpty,
    async (req, res) => {
        const { userInfo } = res.locals
        // VERIFICATION BEGINS
        const isReqObjVerified = verifyReqObjExpectedObjKeys(
            [
                'newOfferName',
                'newOfferDescription',
                'newOfferValue',
                'forServiceID',
            ],
            req.body,
            res
        )
        if (isReqObjVerified.ok === false)
            return customStatusError(
                isReqObjVerified.error,
                res,
                isReqObjVerified.statusCode,
                isReqObjVerified.resString
            )
        const {
            newOfferName,
            newOfferDescription,
            newOfferValue,
            forServiceID,
        } = req.body
        if (userInfo.role !== 'sales_assistant_chef')
            return customStatusError(
                'unauthorized access, no sales_assistant_chef role /service at' +
                    __dirname,
                res,
                401,
                'Unauthorized route'
            )
        try {
            // Verify if service exists
            const servicesStatement =
                'SELECT name FROM services WHERE service_id = $1'
            const servicesQuery = await pool.query(servicesStatement, [
                forServiceID,
            ])
            // check if 'service' value exists in DB, else return 406
            if (servicesQuery.rowCount === 0) {
                const errorStrUnexpectedInput =
                    "requester's requested service ID '" +
                    forServiceID +
                    "' does not exist "
                return customStatusError(
                    errorStrUnexpectedInput,
                    res,
                    406,
                    'your service ID that includes the offer does not exist'
                )
            }
            const offersStatement =
                'SELECT name FROM offers WHERE name = $1 AND service_id = $2 AND active = true'
            const offersQuery = await pool.query(offersStatement, [
                newOfferName,
                forServiceID,
            ])
            if (offersQuery.rowCount !== 0) {
                const errorStrUnexpectedInput =
                    "requester's requested offer '" +
                    newOfferName +
                    "' already exists in database "
                return customStatusError(
                    errorStrUnexpectedInput,
                    res,
                    406,
                    "Your new offer's name already exists"
                )
            }
            // VERIFICATION ENDS
            const queryString =
                'INSERT INTO offers(name, description, service_id, value) VALUES ($1, $2, $3, $4)'
            await pool.query(queryString, [
                newOfferName,
                newOfferDescription,
                forServiceID,
                newOfferValue,
            ])
            return res.status(200).json('Your offer was added successfully!')
        } catch (err) {
            return status500Error(err, res, 'Could not insert offer')
        }
    }
)

app.put(
    '/offer/name',
    authenticateToken,
    verifyReqBodyObjValuesNotEmpty,
    async (req, res) => {
        const { userInfo } = res.locals
        // expected values from URL query
        const { offerID, forServiceID } = req.query
        // expected values from object
        const { newOfferName } = req.body

        // VERIFICATION BEGINS
        // IF the user is not a sales assistant chef, return unauthorized
        if (userInfo.role !== 'sales_assistant_chef')
            return customStatusError(
                'unauthorized access, no sales_assistant_chef role /offer/name at' +
                    __dirname,
                res,
                401,
                'Unauthorized route'
            )
        // verify newOfferName object key exists in request body
        const isReqBodyValid = verifyReqObjExpectedObjKeys(
            ['newOfferName'],
            req.body,
            res
        )
        if (isReqBodyValid.ok === false)
            return customStatusError(
                isReqBodyValid.error,
                res,
                isReqBodyValid.statusCode,
                isReqBodyValid.resString
            )
        // verify offerID, forServiceID object keys exists in request query
        const isReqQueryValid = verifyReqObjExpectedObjKeys(
            ['offerID', 'forServiceID'],
            req.query,
            res
        )
        if (isReqQueryValid.ok === false)
            return customStatusError(
                isReqQueryValid.error,
                res,
                isReqQueryValid.statusCode,
                isReqQueryValid.resString
            )
        // IF the request query fields has empty values, return 406
        const isReqQueryInputNotEmpty = verifyInputNotEmptyFunc(req.query)
        if (isReqQueryInputNotEmpty.ok === false)
            return customStatusError(
                isReqQueryInputNotEmpty.error,
                res,
                isReqQueryInputNotEmpty.statusCode,
                isReqQueryInputNotEmpty.resString
            )
        try {
            // verify offer exists in the database
            const offersStatement =
                'SELECT * FROM offers WHERE offer_id = $1 AND service_id = $2'
            const offersQuery = await pool.query(offersStatement, [
                offerID,
                forServiceID,
            ])
            // if false, return 406
            if (offersQuery.rowCount === 0) {
                const errorStrUnexpectedInput =
                    "requester's requested offer ID '" +
                    offerID +
                    "' with service ID '" +
                    forServiceID +
                    "' does not exist "
                return customStatusError(
                    errorStrUnexpectedInput,
                    res,
                    406,
                    'your requested offer does not exist'
                )
            }
            // if the requested new name change is the same as the old one, return 406
            if (newOfferName === offersQuery.rows[0].name) {
                const errorStrSameName =
                    "requested offer name change '" +
                    newOfferName +
                    "' is no different than " +
                    offersQuery.rows[0].name
                return customStatusError(
                    errorStrSameName,
                    res,
                    406,
                    'Offer name is already the same, no change required'
                )
            }
            // VERIFICATION ENDS
            const queryString =
                'UPDATE offers SET name = $1 WHERE offer_id = $2 AND service_id = $3'
            await pool.query(queryString, [newOfferName, offerID, forServiceID])
            res.status(200).json('Your offer name was updated successfully')
        } catch (err) {
            return status500Error(
                err,
                res,
                'server error while PUTTING offer name'
            )
        }
    }
)

app.put(
    '/offer/description',
    authenticateToken,
    verifyReqBodyObjValuesNotEmpty,
    async (req, res) => {
        const { userInfo } = res.locals
        // expected values from URL query
        const { offerID, forServiceID } = req.query
        // expected values from object
        const { newOfferDescription } = req.body

        // VERIFICATION BEGINS
        // IF the user is not a sales assistant chef, return unauthorized
        if (userInfo.role !== 'sales_assistant_chef')
            return customStatusError(
                'unauthorized access, no sales_assistant_chef role /offer/description at' +
                    __dirname,
                res,
                401,
                'Unauthorized route'
            )
        // verify newOfferDescription object key exists in request body
        const isReqBodyValid = verifyReqObjExpectedObjKeys(
            ['newOfferDescription'],
            req.body,
            res
        )
        if (isReqBodyValid.ok === false)
            return customStatusError(
                isReqBodyValid.error,
                res,
                isReqBodyValid.statusCode,
                isReqBodyValid.resString
            )
        // verify offerID, forServiceID object keys exists in request query
        const isReqQueryValid = verifyReqObjExpectedObjKeys(
            ['offerID', 'forServiceID'],
            req.query,
            res
        )
        if (isReqQueryValid.ok === false)
            return customStatusError(
                isReqQueryValid.error,
                res,
                isReqQueryValid.statusCode,
                isReqQueryValid.resString
            )
        // IF the request query fields has empty values, return 406
        const isReqQueryInputNotEmpty = verifyInputNotEmptyFunc(req.query)
        if (isReqQueryInputNotEmpty.ok === false)
            return customStatusError(
                isReqQueryInputNotEmpty.error,
                res,
                isReqQueryInputNotEmpty.statusCode,
                isReqQueryInputNotEmpty.resString
            )
        try {
            // verify offer exists in the database
            const offersStatement =
                'SELECT * FROM offers WHERE offer_id = $1 AND service_id = $2'
            const offersQuery = await pool.query(offersStatement, [
                offerID,
                forServiceID,
            ])
            // if false, return 406
            if (offersQuery.rowCount === 0) {
                const errorStrUnexpectedInput =
                    "requester's requested offer ID '" +
                    offerID +
                    "' with service ID '" +
                    forServiceID +
                    "' does not exist "
                return customStatusError(
                    errorStrUnexpectedInput,
                    res,
                    406,
                    'your requested offer does not exist'
                )
            }
            // if the requested new description change is the same as the old one, return 406
            if (newOfferDescription === offersQuery.rows[0].description) {
                const errorStrSameName =
                    "requested offer description change '" +
                    newOfferDescription +
                    "' is no different than " +
                    offersQuery.rows[0].description
                return customStatusError(
                    errorStrSameName,
                    res,
                    406,
                    'Offer description is already the same, no change required'
                )
            }
            // VERIFICATION ENDS
            const queryString =
                'UPDATE offers SET description = $1 WHERE offer_id = $2 AND service_id = $3'
            await pool.query(queryString, [
                newOfferDescription,
                offerID,
                forServiceID,
            ])
            res.status(200).json(
                'Your offer description was updated successfully'
            )
        } catch (err) {
            return status500Error(
                err,
                res,
                'server error while PUTTING offer description'
            )
        }
    }
)

app.put(
    '/offer/value',
    authenticateToken,
    verifyReqBodyObjValuesNotEmpty,
    async (req, res) => {
        const { userInfo } = res.locals
        // expected values from URL query
        const { offerID, forServiceID } = req.query
        // expected values from object
        const { newOfferValue } = req.body

        // VERIFICATION BEGINS
        // IF the user is not a sales assistant chef, return unauthorized
        if (userInfo.role !== 'sales_assistant_chef')
            return customStatusError(
                'unauthorized access, no sales_assistant_chef role /offer/value at' +
                    __dirname,
                res,
                401,
                'Unauthorized route'
            )
        // verify newOfferValue object key exists in request body
        const isReqBodyValid = verifyReqObjExpectedObjKeys(
            ['newOfferValue'],
            req.body,
            res
        )
        if (isReqBodyValid.ok === false)
            return customStatusError(
                isReqBodyValid.error,
                res,
                isReqBodyValid.statusCode,
                isReqBodyValid.resString
            )
        // verify offerID, forServiceID object keys exists in request query
        const isReqQueryValid = verifyReqObjExpectedObjKeys(
            ['offerID', 'forServiceID'],
            req.query,
            res
        )
        if (isReqQueryValid.ok === false)
            return customStatusError(
                isReqQueryValid.error,
                res,
                isReqQueryValid.statusCode,
                isReqQueryValid.resString
            )
        // IF the request query fields has empty values, return 401
        const isReqQueryInputNotEmpty = verifyInputNotEmptyFunc(req.query)
        if (isReqQueryInputNotEmpty.ok === false)
            return customStatusError(
                isReqQueryInputNotEmpty.error,
                res,
                isReqQueryInputNotEmpty.statusCode,
                isReqQueryInputNotEmpty.resString
            )
        try {
            // verify offer exists in the database
            const offersStatement =
                'SELECT * FROM offers WHERE offer_id = $1 AND service_id = $2'
            const offersQuery = await pool.query(offersStatement, [
                offerID,
                forServiceID,
            ])
            // if false, return 401
            if (offersQuery.rowCount === 0) {
                const errorStrUnexpectedInput =
                    "requester's requested offer ID '" +
                    offerID +
                    "' with service ID '" +
                    forServiceID +
                    "' does not exist "
                return customStatusError(
                    errorStrUnexpectedInput,
                    res,
                    406,
                    'your requested offer does not exist'
                )
            }
            // if the requested new value change is the same as the old one, return 401
            if (newOfferValue === offersQuery.rows[0].value) {
                const errorStrSameName =
                    "requested offer value change '" +
                    newOfferValue +
                    "' is no different than " +
                    offersQuery.rows[0].value
                return customStatusError(
                    errorStrSameName,
                    res,
                    400,
                    'Offer value is already the same, no change required'
                )
            }
            // VERIFICATION ENDS
            const queryString =
                'UPDATE offers SET value = $1 WHERE offer_id = $2 AND service_id = $3'
            await pool.query(queryString, [
                newOfferValue,
                offerID,
                forServiceID,
            ])
            res.status(200).json('Your offer value was updated successfully')
        } catch (err) {
            return status500Error(
                err,
                res,
                'server error while PUTTING offer value'
            )
        }
    }
)

app.put('/offer/active', authenticateToken, async (req, res) => {
    const { offerID } = req.query
    const { userInfo } = res.locals

    // VERIFICATION BEGINS
    if (userInfo.role !== 'sales_assistant_chef')
        return customStatusError(
            'unauthorized access, no sales_assistant_chef role /offer/active at' +
                __dirname,
            res,
            401,
            'Unauthorized route'
        )
    try {
        const isReqQueryValid = verifyReqObjExpectedObjKeys(
            ['offerID'],
            req.query,
            res
        )
        if (isReqQueryValid.ok === false)
            return customStatusError(
                isReqQueryValid.error,
                res,
                isReqQueryValid.statusCode,
                isReqQueryValid.resString
            )
        // IF the request query fields has empty values, return 406
        const isReqQueryInputNotEmpty = verifyInputNotEmptyFunc(req.query)
        if (isReqQueryInputNotEmpty.ok === false)
            return customStatusError(
                isReqQueryInputNotEmpty.error,
                res,
                isReqQueryInputNotEmpty.statusCode,
                isReqQueryInputNotEmpty.resString
            )
        // get services and store them in array
        const offersStatement = 'SELECT * FROM offers WHERE offer_id = $1'
        const offersQuery = await pool.query(offersStatement, [offerID])
        // check if 'offer' value exists in DB, else return 406
        if (offersQuery.rowCount === 0) {
            const errorStrUnexpectedInput =
                "requester's requested offer's ID '" +
                offerID +
                "' does not exist "
            return customStatusError(
                errorStrUnexpectedInput,
                res,
                406,
                'your requested offer does not exist'
            )
        }
        // VERIFICATION ENDS
        const queryString =
            'UPDATE offers SET active = NOT active WHERE offer_id = $1'
        await pool.query(queryString, [offerID])
        res.status(200).json(
            "Your offer's active state was toggled successfully"
        )
    } catch (err) {
        return status500Error(
            err,
            res,
            'server error while PUTTING offer active'
        )
    }
})
