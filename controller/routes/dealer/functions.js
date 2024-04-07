const pool = require("../../database")
const { 
    status500Error,
    verifyServiceIDFromInput, 
    verfiyOfferIDFromInput,
    customStatusError
} = require("../../helpers/functions")

// *** DEPRECATED FUNCTION *** //
// verifies the client_wants_router input coming from send application
// const verifyClientWantsRouterInput = (input) => {
//     const errorObj = {
//         ok: false,
//         error: "Type of '" + input + "' does not equal 1 or 0",
//         statusCode: 406,
//         resString: "Your clientWantsRouter input is unacceptable"
//     }
//     if (typeof input === "number")
//         if (input === 0 || input === 1)
//             return {ok : true}
//     else if (typeof input === "string")
//         if (input === "0" || input === "1")
//             return {ok: true}
//     return errorObj
    
// }

// verifies the fields coming from send_application (such as client name and client description)
const verifyEmptyFields = (inputArr) => {
    const returnErrField = (faltyInput) => (`input '${faltyInput}' was empty`)
    const errorObj = {
        ok: false,
        error: undefined,
        statusCode: 406,
        resString: "One of the inputted fields were empty"
    }
    for (let i = 0; i < inputArr.length; i++) {
        if (typeof inputArr[i] === "string")
            if (inputArr[i].trim() === "")
                return {...errorObj, error: returnErrField(inputArr[i])}
        else if (typeof inputArr[i] === "number")
            return {...errorObj, error: returnErrField(inputArr[i])}
        }
    return {ok: true}
}

// this function get's the respective sales_activator from database according to the dealer's user_id
const getSaleActivator = async (dealerID, res) => {
    const queryStatment = "SELECT name FROM login WHERE role = 'sales_assistant' AND assigned_area = (SELECT assigned_area FROM login WHERE user_id = $1)"
    try {
        const query = await pool.query(queryStatment, [dealerID])
        return query.rows[0].name
    } catch (error) {
        return status500Error(error, res, "Could not fetch your sales' activator")
    }
}

// this function is responsible for verifying the application request body input coming from sender.
const verifyApplicationInput = async (reqBody) => {
    const { selectedService, selectedOffer, clientDescription, clientName } = reqBody
    try {
        // each function in this array returns an object with key:value ok: true if verification passes, or ok: false and other key
        // values that detail the error that occurred 
        const verifyArray = [
            await verifyServiceIDFromInput(selectedService),
            await verfiyOfferIDFromInput(selectedOffer),
            verifyEmptyFields([clientDescription, clientName])
        ]
        // since each function returns the same 'ok' key, I loop over the array to check if a false value exists in it
        for (let i = 0; i < verifyArray.length; i++) {
            // if the loop finds a false value, it will return that specific object(in the array), and the parent function
            // will handle the error according to that object's error key:value details
            if (verifyArray[i].ok === false) {
                return verifyArray[i]
            }
        }
        // if all verification passes, it returns ok:true and the parent function will know that all verifications has passed.
        return {ok: true}
    } catch (error) {
        console.error(error)
        console.log('RETURNING ERROR')
        return error
    }
}

const sendApplication = async (userInfo, reqBody, photoURLS, res) => {    
    const { userID } = userInfo;
    const { selectedService, selectedOffer, clientDescription, clientName } = reqBody

    const client = await pool.connect()
    try {
        // begin the query transaction
        await client.query('BEGIN')
        // Get the sale activator for the respective application sender(dealer)
        const saleActivator = await getSaleActivator(userID, res)
        // insert into sales_applications and return id
        const query = await client.query("INSERT INTO sales_applications(submitter, submit_time, activator, client_name, status) VALUES($1, $2, $3, $4, $5) RETURNING id"
            , [userID, 'NOW()', saleActivator, clientName, 'sent'])
        // insert into sales_applications_details
        await client.query("INSERT INTO sales_applications_details(client_name, selected_service, selected_offer, description, id, image_urls) VALUES($1, $2, $3, $4, $5, $6)"
            , [clientName, selectedService, selectedOffer, clientDescription, query.rows[0].id, photoURLS])
        // commit all the queries
        await client.query('COMMIT')
        // end the query transaction
        return res.status(200).json("Your application was sent successfully")
    }
     catch (e) {
        await client.query('ROLLBACK')
        return status500Error(e, res, "Could not send your application")
    }
     finally {
        // release the client from it's chains!
        client.release()
    }
}

module.exports = {
    sendApplication,
    verifyApplicationInput,
    getSaleActivator,
}