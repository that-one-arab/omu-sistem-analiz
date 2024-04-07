const pool = require('../controller/database')

const statement = `
DROP TABLE IF EXISTS goals;
DROP TABLE IF EXISTS transaction_reports;
DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS sales_applications_details;
DROP TABLE IF EXISTS sales_applications;
DROP TABLE IF EXISTS login;
DROP TABLE IF EXISTS offers;
DROP TABLE IF EXISTS services;
`;

(async function () {
    await pool.query(statement)
    console.log('Tables dropped')
    process.exit(0)
})()
