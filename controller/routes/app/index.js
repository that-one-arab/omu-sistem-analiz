const express = require("express")
const bcrypt = require("bcrypt")
const pool = require("../../database");
const { status500Error, customStatusError } = require("../../helpers/functions");
const { getDealerApplications, getServices, getSdUsers, getSdcUsers, getSdUser, getSdcUser } = require("./functions")
const { getGoal } = require("../sharedfunctions")
const { authenticateToken, verifyReqBodyObjValuesNotEmpty, verifyReqBodyPasswordNoWhiteSpace } = require("../../helpers/middleware")

const app = module.exports = express();



//**************
//************** I could work on more authentication regarding the expected input from object in the transaction routes below
//**************


// This route returns all of the services, takes active as route query argument. 
app.get("/services", authenticateToken, async (req, res) => {
    try {
        const { active } = req.query
        const selectedStatement = "SELECT * FROM services"
        const activeCondition = " WHERE active = true"
        let serviceStatement = selectedStatement
        if (active)
            serviceStatement = selectedStatement + activeCondition
        
        const serviceQuery = await pool.query(serviceStatement)
        return res.status(200).json(serviceQuery.rows)
    } catch (error) {
        console.log(error)
        return res.status(500).json("an error occurred while fetching services data")
    }
})

app.get("/service/:serviceID", async (req, res) => {
    try {
        const { serviceID } = req.params
        const { active } = req.query

        const selectedStatement = "SELECT * FROM offers WHERE service_id = $1"
        const activeCondition = " AND active = true"
        let offersStatement = selectedStatement
        if (active)
            offersStatement = selectedStatement + activeCondition

        const offersQuery = await pool.query(offersStatement, [serviceID])
        if (offersQuery.rowCount === 0) {
            const errorStr = "offers under requested service ID " + serviceID + " does not exist in database"
            return customStatusError(errorStr, res, 406, "offers under your requested service ID does not exist")
        }
        return res.status(200).json(offersQuery.rows)
    } catch (error) {
        console.log(error)
        return res.status(500).json("an error occurred while fetching services data")
    }
})

// This route returns a specific application according to it's ID.
// If the request submitter is the same dealer who submitted the application, return 
// respective application, if not, return 403.
// If the request submitter is SD or SDC, return application
app.get("/application/:applicationID", authenticateToken, async(req, res) => {
    try {
        const queryStatement = "SELECT sales_applications.id, sales_applications.client_name, sales_applications.submit_time, sales_applications_details.selected_service AS service_id, services.name AS service_name, sales_applications_details.selected_offer AS offer_id, offers.name AS offer_name, sales_applications_details.description, sales_applications.status, sales_applications_details.sales_rep_details, sales_applications_details.status_change_date, sales_applications_details.final_sales_rep_details, sales_applications.last_change_date, sales_applications_details.image_urls FROM sales_applications INNER JOIN sales_applications_details ON sales_applications.id=sales_applications_details.id INNER JOIN services ON services.service_id = sales_applications_details.selected_service INNER JOIN offers ON offers.offer_id = sales_applications_details.selected_offer WHERE sales_applications.id = $1"
        const submitterConditionalStatement = " AND submitter = $2"
        const customErr = "at application/:applicationID, database query returned an empty array"
        const reqSubmitterRole = res.locals.userInfo.role
        const { applicationID } = req.params
        let query
        // if the request submitter is SDC or SD, return any application regardless of who is the application submitter
        if (reqSubmitterRole !== "dealer")
            query = await pool.query(queryStatement, [applicationID])
        // else, return the application ONLY if the request submitter is the same as the application submitter
        else {
            query = await pool.query(queryStatement + submitterConditionalStatement, [applicationID, res.locals.userInfo.userID])
            // if the submitter who requested the application through application ID returns
            // empty (probably because reqSubmitterRole is not the same as application submitter) return error
            if (query.rows.length === 0)
                return customStatusError(customErr, res, 403, "You are not authorized to fetch this application")
        }
        //if all good return query
        return res.status(200).json(query.rows)
    } catch (err) {
        return status500Error(err, res, "server error could not fetch specific application")
    }
})


app.get("/applications/:query", authenticateToken, async (req, res) => {
    const { query } = req.params
    const { status, interval, service, day, month, year } = req.query

    let userID
    if (res.locals.userInfo.role !== "sales_assistant_chef" && res.locals.userInfo.role !== "sales_assistant")
        userID = res.locals.userInfo.userID
    else
        if (req.query.userID)
            userID = req.query.userID
        else
            userID = "ALL"
        
    try {
        let selectQuery
        // If the REQUEST QUERY date variables are month and year
        if (month || year || day) {
            const dayObj = {day, month, year}
            selectQuery = await getDealerApplications(query, dayObj, userID, status, service)
        }
        // ELSE IF the REQUEST QUERY date variables are interval
        else
            selectQuery = await getDealerApplications(query, interval, userID, status, service)
        return res.status(200).json(selectQuery)
    } catch (error) {
        console.log(error)
        return res.status(500).json("server error, Unable to fetch dealer applications")
    }
})

app.get("/user", authenticateToken, async (req, res) => {
    try {
        const { userID } = res.locals.userInfo
        const selectStatement = "SELECT role, balance, register_date, email, name FROM login WHERE user_id = $1"
        const query = await pool.query(selectStatement, [userID])
        return res.status(200).json(query.rows)
    } catch (err) {
        return status500Error(err, res, "server error, Could not fetch your information")
    }
})

// This route is responsible for changing the submitter's password
app.patch("/user/password", authenticateToken, verifyReqBodyObjValuesNotEmpty, verifyReqBodyPasswordNoWhiteSpace, async (req, res) => {
    try {
        const { userID } = res.locals.userInfo
        // const userID = "1fa591a4cksg064ub"
        const { password } = req.body
        const hash = await bcrypt.hash(password, 10);
        const updateStatement = "UPDATE login SET hash = $1 WHERE user_id = $2"
        await pool.query(updateStatement, [hash, userID])
        return res.status(200).json("Your password change was a success")
    } catch (err) {
        return status500Error(err, res, "server error, unable to change your password")
    }
})
// This route is responsible for changing the submitter's name (account name)
app.patch("/user/name", authenticateToken, verifyReqBodyObjValuesNotEmpty, async (req, res) => {
    try {
        const { userID } = res.locals.userInfo
        // const userID = "1fa5915jwksg069fe"
        const { name } = req.body
        const updateStatement = "UPDATE login SET name = $1 WHERE user_id = $2"
        await pool.query(updateStatement, [name, userID])
        return res.status(200).json("Your name change was a success")
    } catch (err) {
        return status500Error(err, res, "server error, unable to change your name")
    }
})

// This route is pretty straight forward. dealer role are not allowed to access it but SD and SDC can.
// It returns a specific user that fall under the responsibility of the SD who submitted
// this request. Or if the submitter is SDC, returns any specific user requested by SDC
app.get("/user/:requestedUserID", authenticateToken, async (req, res) => {
    // FOR TESTING PURPOSES DELETE BELOW OBJECT LATER
    // const userInfo = {
    //     role: "sales_assistant_chef",
    //     name: "Adnan Oktar",
    //     userID: "1fa591a4cksg064ub"
    // }
    const { userInfo } = res.locals
    const requesterID = userInfo.userID
    const { requestedUserID } = req.params
    const { role } = userInfo
    if (role === "sales_assistant")
        await getSdUser(requesterID, requestedUserID, res)
    else if (role === "sales_assistant_chef")
        await getSdcUser(requestedUserID, res)
    else
        return customStatusError("user ID'" + requesterID + "' attempted to access /users but did not have 'sales_assistant' role", res, 403, "You do not have permission to access this route")
})

// This route is also pretty straight forward. dealer role are not allowed to access it but SD and SDC can.
// It returns a list of dealer users that fall under the responsibility of the SD who submitted
// this request. Or if the submitter is SDC, returns all users
app.get("/users", authenticateToken, async (req, res) => {
    const { userInfo } = res.locals
    const { role, name } = userInfo
    if (role === "sales_assistant")
        await getSdUsers(name, res)
    else if (role === "sales_assistant_chef")
        await getSdcUsers(res)
    else
        return customStatusError("user '" + name + "' attempted to access /users but did not have 'sales_assistant' role", res, 403, "You do not have permission to access this route")
})

// This route is responsible for returning goals, it takes the arguments in req.query
// The arguments are dynamic and can be omitted. It returns an object with details
// regarding the respective query.
app.get("/goal", authenticateToken, async (req, res) => {
    try {
        const { service, userID, month, year } = req.query
        let submitterID
        // If the submitter's role is a dealer, assign submitter ID to his own ID
        if (res.locals.userInfo.role === "dealer")
            submitterID = res.locals.userInfo.userID
        // else assign submitterID to whatever the requester sent in req.query
        else
            submitterID = userID
        const result = await getGoal(service, submitterID, month, year)
        return res.json(result)
    } catch (err) {
        return status500Error(err, res, "server error, could not fetch your goal")
    }
})


// This route is responsible for fetching all the transactions made by the requester(dealer)
// it takes date as a query parameter, if omitted, it returns all transactions regardless of date
// if its appended, it returns all transactions made in the entire month in the date
app.get("/transactions", authenticateToken, async (req, res) => {
    const { userInfo } = res.locals
    const { userID } = userInfo
    const { date } = req.query
    try {
        if (date) {
            const queryStatement = "SELECT * FROM transactions WHERE EXTRACT(month from date) = (SELECT date_part('month', $1 ::timestamp)) AND EXTRACT(year from date) = (SELECT date_part('year', $1 ::timestamp)) AND user_id = $2"
            const query = await pool.query(queryStatement, [date, userID])
            return res.json(query.rows)
        } else {
            const queryStatement = "SELECT * FROM transactions WHERE user_id = $1"
            const query = await pool.query(queryStatement, [userID])
            return res.json(query.rows)
        }        
    } catch (error) {
        return status500Error(error, res, "Could not fetch your transactions")
    }
})

// This route is responsible for fetching all the transactions made by the requested userID
// it takes userID as a mandatory url parameter and date as a query parameter, if omitted, it returns all transactions regardless of date by that user
// if its appended, it returns all transactions made in the entire month in the date by that user
app.get("/transactions/:userID", authenticateToken, async (req, res) => {
    const { userInfo } = res.locals

    const { role } = userInfo
    if (role === "sales_assistant")
        return customStatusError("role is " + role, res, 401, "You are not authorized to make this query")
    const { userID } = req.params
    const { date } = req.query
    try {
        if (date) {
            const queryStatement = "SELECT * FROM transactions WHERE EXTRACT(month from date) = (SELECT date_part('month', $1 ::timestamp)) AND EXTRACT(year from date) = (SELECT date_part('year', $1 ::timestamp)) AND user_id = $2"
            const query = await pool.query(queryStatement, [date, userID])
            return res.json(query.rows)
        } else {
            const queryStatement = "SELECT * FROM transactions WHERE user_id = $1"
            const query = await pool.query(queryStatement, [userID])
            return res.json(query.rows)
        }   
    } catch (error) {
        return status500Error(error, res, "Could not fetch this user's transactions")        
    }
})


// This route is responsible for fetching a specific application's transaction (if the transaction exists).
// it has two possible return values according to the submitter's role
// if it's 'dealer', it returns the app's transaction if the app belongs to the submitter(dealer)
// if it's sales assistant or chef, it returns the app's transaction regardless
app.get("/transaction/:appID", async (req, res) => {
    const { userInfo } = res.locals

    const { appID } = req.params
    const { role } = userInfo
    try {
        if (role === "dealer") {
            const { userID } = userInfo
            const queryStatement = "SELECT * FROM transactions WHERE user_id = $1 AND app_id = $2"
            const query = await pool.query(queryStatement, [userID, appID])
            return res.json(query.rows)
        } else if (role === "sales_assistant" || role === "sales_assistant_chef") {
            const queryStatement = "SELECT * FROM transactions WHERE app_id = $1"
            const query = await pool.query(queryStatement, [appID])
            return res.json(query.rows)
        }
    } catch (error) {
        return status500Error(error, res, "Could not fetch that specific application's transaction")
    }
})

// This route is responsible for fetching the requester's transaction reports, it returns the sum of all earnings made in the
// queried month, it takes date and report_id as parameters to the query, if date, returns that month's user transactions, else
// if reportID, returns that transaction_report_id's transactions, else return all user's transactions
app.get("/report/transactions", authenticateToken, async (req, res) => {
    const { userInfo } = res.locals
    const { date, reportID } = req.query

    const queryStatement = "SELECT * FROM transaction_reports WHERE user_id = $1"
    const queryStatementDate = "SELECT * FROM transaction_reports WHERE user_id = $1 AND EXTRACT(month from date) = (SELECT date_part('month', $2 ::timestamp)) AND EXTRACT(year from date) = (SELECT date_part('year', $2 ::timestamp))"
    const queryStatementAppTransacForReport = "SELECT sales_applications_details.client_name, sales_applications_details.selected_service, transactions.amount, transactions.app_id, transactions.transaction_id, transactions.balance_before, transactions.balance_after, to_char(transactions.date, 'YYYY-MM-DD') AS date, transactions.report_id FROM sales_applications_details INNER JOIN transactions ON sales_applications_details.transaction_id = transactions.transaction_id WHERE transactions.report_id = $1 AND transactions.user_id = $2"
    let query

    try {
        if (date)
            query = await pool.query(queryStatementDate, [userInfo.userID, date])
        else if (reportID)
            query = await pool.query(queryStatementAppTransacForReport, [reportID, userInfo.userID])
        else
            query = await pool.query(queryStatement, [userInfo.userID])
        return res.json(query.rows)
    } catch (error) {
        return status500Error(error, res, "Could not fetch transaction report")        
    }
})

app.get("/report/transactions/count", authenticateToken, async (req, res) => {
    const { userInfo } = res.locals
    const { date } = req.query
    const queryStatement = "SELECT COUNT(report_id) FROM transaction_reports WHERE user_id = $1"
    const queryStatementDate = "SELECT COUNT(report_id) FROM transaction_reports WHERE user_id = $1 AND EXTRACT(month from date) = (SELECT date_part('month', $2 ::timestamp)) AND EXTRACT(year from date) = (SELECT date_part('year', $2 ::timestamp))"
    let query
    try {
        if (date)
            query = await pool.query(queryStatementDate, [userInfo.userID, date])
        else
            query = await pool.query(queryStatement, [userInfo.userID])
        if (query.rows[0].count)
            return res.json(query.rows[0])
        else
            return res.json("0")
    } catch (error) {
        return status500Error(error, res, "Could not fetch transaction report")        
    }
})

// This route is responsible for fetching the requester's requested user's transactions' reports.
// it takes { userID, date } as mandatory url parameters 
app.get("/report/transactions/:userID", authenticateToken, async (req, res) => {
    const { userInfo } = res.locals

    if (userInfo.role !== "sales_assistant_chef" && userInfo.role !== "sales_assistant")
        return customStatusError("user role: '"+userInfo.role+"' is not authenticated", res , 401, "You're not authenticated to make this request")
    const { userID } = req.params
    const { date } = req.query
    try {
        if (date)
            queryStatement = "SELECT * FROM transaction_reports WHERE user_id = $1 AND EXTRACT(month from date) = (SELECT date_part('month', $2 ::timestamp)) AND EXTRACT(year from date) = (SELECT date_part('year', $2 ::timestamp))"
        else
            queryStatement = "SELECT * FROM transaction_reports WHERE user_id = $1"
        const query = await pool.query(queryStatement, [userID, date])
        return res.json(query.rows)
    } catch (error) {
        return status500Error(error, res, "Could not fetch transaction report")        
    }
})


// app.get("/bayi/applications", authenticateToken, async(req, res) => {
//     try {
//         const username = res.locals.userInfo.username
//         const { status } = req.query
//         const response = await forDealerGetApplications(username, status)
//         res.status(200).json(response)
//     } catch (error) {
//         console.error(error)
//         res.status(500)
//     }
// })
