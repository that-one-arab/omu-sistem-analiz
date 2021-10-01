const pool = require("../../database")
const { 
    status500Error, 
    customStatusError
} = require("../../helpers/functions")

// get's the value of an offer either according to offer's name and it's service_id, or it's offerID
const getOfferValue = async (serviceID, offerName = undefined, offerID = undefined) => {
    let query
    if (offerName)
        query = await pool.query("SELECT value FROM offers WHERE service_id = $1 AND name = $2", [serviceID, offerName])
    else
        query = await pool.query("SELECT value FROM offers WHERE offer_id = $1", [offerID])
    return query.rows[0].value
}

const updateApplicationPhase1 = async (client, statusChange, salesRepDetails, appID) => {
    try {
        await client.query("UPDATE sales_applications_details SET sales_rep_details = $1, status_change_date = CURRENT_TIMESTAMP WHERE id = $2",
            [salesRepDetails, appID])
        await client.query("UPDATE sales_applications SET status = $1 WHERE id = $2", [statusChange, appID])
        return {done: true}
    } catch (err) {
        return {done: false, error: err}
    }
}

const updateApplicationPhase2 = async (client, statusChange, salesRepDetails, appID) => {
    try {
        await client.query("UPDATE sales_applications_details SET final_sales_rep_details = $1 WHERE id = $2", [salesRepDetails, appID])
        await client.query("UPDATE sales_applications SET status = $1, last_change_date = CURRENT_TIMESTAMP WHERE id = $2", [statusChange, appID])
        // The code below runs only when the SD approved the application, it makes a transaction to the dealer who submitted the app.
        // Adds a transaction record, checks for goals if they exist and whether they're fullfilled or not and increment them
        if (statusChange === "approved") {
            // get the offer name and service name
            const getServiceAndOffer = await client.query("SELECT selected_service, selected_offer FROM sales_applications_details WHERE id = $1", [appID])
            const { selected_service, selected_offer } = getServiceAndOffer.rows[0]

            // submitter holds the same value as user_id
            const getSubmitter = await client.query("SELECT submitter FROM sales_applications WHERE id = $1", [appID])
            const { submitter } = getSubmitter.rows[0]

            // get the id of the service
            const getServiceID = await client.query("SELECT service_id FROM services WHERE name = $1", [selected_service])
            const serviceID = getServiceID.rows[0].service_id

            // get the value (money) of that specific offer
            const offerValue = await getOfferValue(serviceID, selected_offer)

            // user's balance before transaction
            const userBalanceBefore = await client.query("SELECT balance FROM login WHERE user_id = $1", [submitter])
            const balanceBefore = userBalanceBefore.rows[0].balance

            // user's balance after transaction
            const balanceAfter = Number(balanceBefore) + Number(offerValue)

            // insert the tranasction record
            const insertTransactionAndReturnID = await client.query("INSERT INTO transactions VALUES($1, $2, $3, $4, $5) RETURNING transaction_id",
             [submitter, appID, balanceBefore, offerValue, balanceAfter])
            // update user's balance
            await client.query("UPDATE login SET balance = balance + $1 WHERE user_id = $2", [offerValue, submitter])
            
            // update the transaction_id column for the respective application
            const transactionID = insertTransactionAndReturnID.rows[0].transaction_id
            await client.query("UPDATE sales_applications_details SET transaction_id = $1 WHERE id = $2", [transactionID, appID])
            
            // this code block checks if a goal exists for the respective service, respective user and the respective date. If it exists, it checks whether
            // it's fullfilled or not (the goal barrem reached), if true, it updates success to true then performs the increment. if false, it performs the
            // increment regardless
            const checkGoalSuccessStatement = "SELECT goal, done, goal_id FROM goals WHERE EXTRACT(month from for_date) = (SELECT date_part('month', (SELECT current_timestamp))) AND EXTRACT(year from for_date) = (SELECT date_part('year', (SELECT current_timestamp))) AND service = $1 AND for_user_id = $2"
            const checkGoalSuccessQuery = await client.query(checkGoalSuccessStatement, [selected_service, submitter])
            if (checkGoalSuccessQuery.rowCount === 1) {
                if (checkGoalSuccessQuery.rows[0].done === checkGoalSuccessQuery.rows[0].goal)
                    await client.query("UPDATE goals SET success = true, done = done + 1 WHERE goal_id = $1", [checkGoalSuccessQuery.rows[0].goal_id])
                else {
                    await client.query("UPDATE goals SET done = done + 1 WHERE goal_id = $1", [checkGoalSuccessQuery.rows[0].goal_id])
                }
            }

        }
        return {done: true}
    } catch (err) {
        return {done: false, error: err}
    }
}

const verifyUserID = async (userID, res) => {
    try {
        verifyStatement = "SELECT user_id FROM login WHERE user_id = $1"
        const query = await pool.query(verifyStatement, [userID])
        if (query.rows.length === 0) {
            const errorStr = "user with ID '" + userID + "' does not exist in database"
            return customStatusError(errorStr, res, 401, "User does not exist")
        }
        return true
        
    } catch (err) {
        status500Error(err, res, "An error occurred while verifying user")
    }
}

const verifySdResponsibleForUser = async (userID, sdID) => {
    verifyQueryStatement = "SELECT user_id FROM login WHERE assigned_to = (SELECT responsible_area FROM login WHERE user_id = $1)"
    const query = await pool.query(verifyQueryStatement, [sdID])
    if (query.rows[0].user_id !== userID)
        return false
    return true
}

module.exports = {
    updateApplicationPhase1,
    updateApplicationPhase2,
    verifyUserID,
    verifySdResponsibleForUser,
}