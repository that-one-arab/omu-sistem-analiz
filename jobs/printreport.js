const pool = require("./controller/database")
const mailgun = require("./lib/mailgun")
const { parentPort } = require("worker_threads")
const uniqid = require("uniqid")

let isCancelled = false;



// this function get's called by the bree library
// it runs on each begining of the month
// it runs for each dealer in the database
// it inserts a new record into the transaction_reports table, the record contains the sum of all earnings the dealer earned previous month.
(async () => {
    const client = await pool.connect()
    try {
        await client.query("BEGIN")
        // get all dealers user ids
        const getDealersQuery = await client.query("SELECT user_id FROM login WHERE role = 'dealer'")
        // map user_ids to create an array of user_ids
        const dealers = getDealersQuery.rows.map(obj => (obj.user_id))
        // query statement
        const transactionStatement = "SELECT SUM(amount) FROM transactions WHERE EXTRACT(month from date) = (SELECT date_part('month', (SELECT date_trunc('day', NOW() - interval '1 month')))) AND EXTRACT(year from date) = (SELECT date_part('year', (SELECT date_trunc('day', NOW() - interval '1 month')))) AND user_id = $1"
        // get current date
        const date = new Date()
        // change it to previous month, while always setting day equal to '01'
        const prevMonthDate = `${date.getFullYear()}-${date.getMonth()}-${'01'}`
        // for every dealer (user_id)
        for (let i = 0; i < dealers.length; i++) {
            // get the transactions the user made the previous month
            const transactionsQuery = await client.query(transactionStatement, [dealers[i]])
            // declare a variable for readability
            const transactionSum = transactionsQuery.rows[0].sum
            // if the dealer had made transactions in the previous month... (it returns null if the dealer hasn't made any transactions)
            if (transactionSum !== null) {
                //insert a new record into the transaction_reports table, containing the sum of all previous month's transactions, return the transaction_report_id
                const insertAndReturnReportID = await client.query("INSERT INTO transaction_reports VALUES ($1, $2, $3) RETURNING report_id", [dealers[i], transactionSum, prevMonthDate])
                // the returned report ID will be used to update the transactions that are part of the report, to make future reports easy to query it's respective transactions
                const reportID = insertAndReturnReportID.rows[0].report_id
                // update statement
                const updateTransactionsStatement = "UPDATE transactions SET report_id = $1 WHERE EXTRACT(month from date) = (SELECT date_part('month', (SELECT date_trunc('day', NOW() - interval '1 month')))) AND EXTRACT(year from date) = (SELECT date_part('year', (SELECT date_trunc('day', NOW() - interval '1 month')))) AND user_id = $2"
                // perform the update
                await client.query(updateTransactionsStatement, [reportID, dealers[i]])
                console.log('printed report for user_id ', dealers[i])
            }
        }
        // after loop has finished, commit the changes
        await client.query("COMMIT")
        // release client and end function
        client.release()
        if (parentPort) parentPort.postMessage('done');
        process.exit(0);
    } catch (error) {
        const errorID = uniqid("BREE-TIMED-FUNCTION-ERROR-ID-") 
        console.log(errorID, " ", error)
        await client.query('ROLLBACK')
        client.release()
        const emailData = {
            from: '<info@obexport.com>',
            to: 'mohammad.nadom98@gmail.com',
            subject: 'PRINT REPORT SERVER ERROR',
            text: "A server error occurred while printing monthly transaction report, the error's content is \n " + errorID + ": "+error
        }
        mailgun.messages().send(emailData, (err, body) => {
            if (err) console.log(err)
            console.log('successfuly sent an email to mohammad.nadom98@gmail.com, body: ', body)
            process.exit(0);
        });
    }
})();