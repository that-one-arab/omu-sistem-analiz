const pool = require("../database")
const {
    queryConstructorDate, 
    switchServiceNameToTurkish,
    getDealerName
} = require("../helpers/functions")

const getGoal = async (services = "ALL", userID = "ALL", month = "ALL", year = "ALL") => {
    // Statements...
    const goalSelectStatement = "SELECT goals.for_date, goals.done, goals.goal, goals.goal_id, goals.for_user_id, goals.service_id, services.name AS service FROM goals INNER JOIN services ON services.service_id = goals.service_id"
    const serviceConditionStatement = "goals.service_id ="
    const userConditionStatement = "goals.for_user_id ="
    const extractMonthStatement = "EXTRACT(MONTH FROM goals.for_date) ="
    const extractYearStatement = "EXTRACT(YEAR FROM goals.for_date) ="

    // If service == "ALL", dont change it since it will be omitted below anyways, ELSE, to prevent unicode in URL query
    // params, switch the service name to turkish letters to match it in the database
    let service
    if (services === "ALL")
        service = services
    else service = switchServiceNameToTurkish(services)

    let monthParam, yearParam
    if (month === "current" && year === "current") {
        const getDateQuery = await pool.query("SELECT date_part('month', (SELECT current_timestamp)) AS month, date_part('year', (SELECT current_timestamp)) AS year")
        monthParam = getDateQuery.rows[0].month
        yearParam = getDateQuery.rows[0].year
    } else {
        monthParam = month
        yearParam = year
    }
    
    // Original arrays of query parameters and statements
    const queryParams = [service, userID, monthParam, yearParam]
    const queryConditionStatements = [serviceConditionStatement, userConditionStatement, extractMonthStatement, extractYearStatement]

    // Verified arrays of query parameters and statements
    let verifiedQueryParams = []
    let verifiedQueryConditionStatements = []
    for (let i = 0; i < queryParams.length; i++) {
        if (queryParams[i] !== "ALL") {
            verifiedQueryParams.push(queryParams[i])
            verifiedQueryConditionStatements.push(queryConditionStatements[i])
        }
    }

    // Final statement that will get submitted
    const finalQueryStatement = queryConstructorDate(goalSelectStatement, verifiedQueryConditionStatements)
    // console.log('STATEMENT: ', finalQueryStatement, "\n", "PARAMS: ", verifiedQueryConditionStatements)
    try {
        const finalQuery = await pool.query(finalQueryStatement, verifiedQueryParams)
        return finalQuery.rows
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    getGoal
}