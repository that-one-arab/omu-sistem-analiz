const express = require("express");
const pool = require("../../database");
const { customStatusError, status500Error, verifyReqObjExpectedObjKeys } = require("../../helpers/functions");
const { authenticateToken, verifyReqBodyObjValuesNotEmpty } = require("../../helpers/middleware");
const { verifyUpdateApplication } = require("./middleware");
const { 
    updateApplicationPhase1, 
    updateApplicationPhase2, 
    verifyUserID,
    verifySdResponsibleForUser
} = require("./functions");
const { getGoal } = require("../sharedfunctions")

const app = module.exports = express();

// This route is responsible for updating an application's status, alongside a short explanation regarding the status change.
// It accepts two fields from req.body. { salesRepDetails, statusChange }. These two fields are mandatory. It fires two functions
// based on a condition:
// IF the application has the current status of 'sent', call updateApplicationPhase1 function.
// IF the application has the current status of 'sent' and statusChange of 'rejected', call updateApplicationPhase2 function.
// IF the application DOES NOT have current status of 'sent', call updateApplicationPhase2 function.
app.put("/application/:applicationID",
    verifyReqBodyObjValuesNotEmpty, 
    verifyUpdateApplication,
    async (req, res) => {
    // verify expected request body object keys
    const isReqObjVerified = verifyReqObjExpectedObjKeys(["salesRepDetails", "statusChange"], req.body)
    if (isReqObjVerified.ok === false)
        return customStatusError(isReqObjVerified.error, res, isReqObjVerified.statusCode, isReqObjVerified.resString)

    // deconstructure the appID and status values from verifyUpdateApplication middleware
    const { appID, currentStatus } = res.locals.updateAppQuery
    // get the sales rep (sales assistant) details and new status from req.body
    const { salesRepDetails, statusChange } = req.body
    // error strings
    const serverErrorStr = "server error occurred while attempting to update application"
    const unexpectedStatusChangePhase1 = "Expected 'processing' or 'rejected' instead got '" + statusChange + "' AT " + __dirname 
    const unexpectedStatusChangePhase2 = "Expected 'approved' or 'rejected' instead got '" + statusChange + "' AT " + __dirname 

    const client = await pool.connect()
    try {
        await client.query('BEGIN')
        let result // result returns an object that contains done bool, and IF err, error string keys.
        // if the application has not been processed yet...
        if (currentStatus === "sent") {
            // IF approved, return error to prevent unexpected status change input (user can not update an application to 'approved' that has current status of 'sent')
            if (statusChange === "approved")
                return customStatusError(unexpectedStatusChangePhase1, res, 401, "Unexpected input")
            // IF rejected, jump to phase2 since no further updates will be allowed after 'rejected' status
            else if (statusChange === "rejected")
                result = await updateApplicationPhase2(client, statusChange, salesRepDetails, appID)
            // ELSE
            else
                result = await updateApplicationPhase1(client, statusChange, salesRepDetails, appID)
        // else the application has been processed, and awaits approval or rejection...
        } else {
            // prevent unexpected status change input
            if (statusChange === "processing")
                return customStatusError(unexpectedStatusChangePhase2, res, 401, "Unexpected input")
            result = await updateApplicationPhase2(client, statusChange, salesRepDetails, appID)
        }
        // if everything runs successfully...
        if (result.done) {
            await client.query('COMMIT')
            return res.status(200).json("Application was updated successfully")
        // ELSE
        } else {
            await client.query('ROLLBACK')
            return status500Error(result.error, res, serverErrorStr)
        }
    } catch (err) {
        await client.query('ROLLBACK')
        status500Error(err, res, serverErrorStr)
    } finally {
        client.release()
        return
    }
})

// This route returns a specific user's goal, it first verifies if the SD request submitter's requested user's goal BELONGS to his area
// along with some other checks, if all checks pass, it returns that user's goal 
app.get("/goal/sd", async(req, res) => {
    // const sdID = res.locals.userInfo.userID
    const { userID, services, month, year } = req.query
    const sdID = "1fa591a4cksg064ub"
    if (userID) {
        await verifyUserID(userID, res)
        if (!await verifySdResponsibleForUser(userID, sdID)) {
            const errorStr = "user ID '" + userInfo.userID + "' attempted to access /goal/sd and fetch specific user ID '"+ req.query.userID +"'s goal but did not have permission because the user does not fall under their responsibility at "+ __dirname
            return customStatusError(errorStr, res, 403, "you are not responsible for this user")
        }
        const dealerGoals = await getGoal(services, userID, month, year)
        return res.json(dealerGoals)
    } else {
        res.json('req query is empty')
    }
})

// app.get("/testtest", async(req, res) => {
//     const getDealersQuery = await pool.query("SELECT user_id FROM login WHERE role = 'dealer'")
//     const dealers = getDealersQuery.rows.map(obj => (obj.user_id))

//     const transactionStatement = "SELECT SUM(amount) FROM transactions WHERE EXTRACT(month from date) = (SELECT date_part('month', (SELECT current_timestamp))) AND EXTRACT(year from date) = (SELECT date_part('year', (SELECT current_timestamp))) AND user_id = $1"
//     for (let i = 0; i < dealers.length; i++) {
//         const transactionsQuery = await pool.query(transactionStatement, [dealers[i]])
//         const transactionSum = transactionsQuery.rows[0].sum
//         if (transactionSum !== null) {
//             await pool.query("INSERT INTO transaction_reports VALUES ($1, $2)", [dealers[i], transactionSum])
//         }
//     }
//     return res.json("done")
// })