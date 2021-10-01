const pool = require("../../database")
const { queryConstructorDate, customStatusError, switchServiceNameToTurkish } = require("../../helpers/functions")


function verifyDateValues(dateObj) {
    let returnVal = []
    for (const key in dateObj) {
        if (isNaN(dateObj[key]))
            returnVal.push("ALL")
        else
            returnVal.push(dateObj[key])
    }
    return returnVal
}

// a query constructor specific to INTERVAL queries
const queryConstructorInterval = (selectStatement, conditionArr) => {
    let conditionText = ""
    for (let i = 0; i < conditionArr.length; i++) {
        if (i === 0)
            conditionText = ` WHERE ${conditionArr[i].statement}`
        else if (conditionArr[i].nestedSelect === true)
            conditionText = conditionText + " AND " + conditionArr[i].statement + "$" + i + " )"
        else
            conditionText = conditionText + " AND " + conditionArr[i].statement + "$" + i
    }
    return selectStatement + conditionText
}

// Converts the INTERVAL input sent through the REQUEST INTERVAL QUERY PARAMS to an sql statement, and returns an sql statement
const convertDateInputToSQLInterval = (interval) => {
    let conditionTime = "submit_time > now() - interval"
    switch (interval) {
        case "today":
            conditionTime = conditionTime + "' 1 day'"
            break
        case "week":
            conditionTime = conditionTime + "' 7 day'"
            break
        case "month":
            conditionTime = conditionTime + "' 30 day'"
            break
        case "year":
            conditionTime = conditionTime + "' 365 day'"
            break
        case "ALL":
            conditionTime = conditionTime + "' 99 year'"
            break
        default:
            throw new Error("Unexpected input at convertDateInputToSQLInterval")
    }
    return conditionTime
}



// This function runs through a special condition, it maps through all the services, and it returns an array of objects
// each object has a unique key property which is the 'service', and a status count for each service. EG:
//  {
//     "service": "Taahüt",
//     "service_id": 15
//     "approvedCount": "0",
//     "rejectedCount": "1",
//     "processingCount": "3",
//     "sentCount": "0",
//   }
const mapAppsAccordToServices = async (userID, date) => {
    const { month, year } = date
    const FOR_SDC_GET_APPLICATION_CRITERIA_COUNT = "SELECT COUNT(sales_applications.submitter) FROM sales_applications WHERE sales_applications.status = $1 AND sales_applications.id IN (SELECT id FROM sales_applications_details WHERE selected_service = $2) AND sales_applications.submitter = $3 AND EXTRACT(YEAR FROM sales_applications.submit_time) = $4"
    // month condition statement
    const extractMonthCondition = " AND EXTRACT(MONTH FROM sales_applications.submit_time) = $5"
    const services = await pool.query("SELECT service_id, name FROM services WHERE active = true")
    const statusArray = ["approved", "rejected", "processing", "sent"]
    // define the final query statement
    let queryStatement = FOR_SDC_GET_APPLICATION_CRITERIA_COUNT
    // insert the month query parameter into a temporary array
    let monthQueryParam = []
    // if month's value is equal to 'ALL', omit adding the month condition statement and the month query parameter, else add them.
    if (month !== "ALL") {
        queryStatement = queryStatement + extractMonthCondition
        monthQueryParam.push(month)
    }
    let result = []
    // mapping over the services array received from query
    for (let i = 0; i < services.rows.length; i++) {
        // mapping over the application status array 
        for (let j = 0; j < statusArray.length; j++) {
            //querying the database based on each status in the array through the for loop
            let query = await pool.query(queryStatement, [statusArray[j], services.rows[i].service_id, userID, year, ...monthQueryParam])

            // storing the result in the object that follows the i index using dynamic keys, example: ${approved}Count: 20
            result[i] = {...result[i], [`${statusArray[j]}Count`]: query.rows[0].count}
        }
        //after status database queries loop is finished, add the service name and ID to the same object
        result[i] = {...result[i], service: services.rows[i].name, service_id: services.rows[i].service_id}
        //repeat
    }
    return result
}

// Just your average query that returns itself, except that the condition for OTHER services is a value in a list
// of values EG: WHERE services IN (nakil, iptal ETC....)
const fetchDigerServices = async (userID) => {
    const otherServicesQuery = await pool.query(FOR_SDC_GET_USER_APPS_ACCORDINGTO_OTHER_SERVICES_AND_USERID, [userID])
    return otherServicesQuery.rows
}

const fetchAppsAccordToInterval = async (query, interval, selectStatement, conditionArr, conditionQueryArr) => {
    const conditionTime = conditionQueryArr[0]
    //verified condition params and query arrays
    let verifiedConditionParamsArr = []
    // if interval = ALL, add conditionTime at first index. Reason is the for loops pushes any value that !== ALL.
    // And this statement prevents duplicate conditionTime
    let verifiedConditionQueryArr = interval === "ALL" ?  [conditionTime] : []
    for (let i = 0; i < conditionArr.length; i++) {
        if (conditionArr[i] !== "ALL") {
            verifiedConditionParamsArr.push(conditionArr[i])
            verifiedConditionQueryArr.push(conditionQueryArr[i])
        }
    }
    // removes the first value to prevent the query parameter array from erroring because it has 1 more value than
    // the query statement.
    if (interval !== "ALL")
        verifiedConditionParamsArr.shift()
    const queryString = queryConstructorInterval(selectStatement, verifiedConditionQueryArr)
    // console.log("Query string: ", queryString, "\n Condition params: ",  verifiedConditionParamsArr)
    const dbQuery = await pool.query(queryString, verifiedConditionParamsArr)
    // if query is details, return the entire array of objects, else return only the object in the array.
    return query === "details" ? dbQuery.rows : dbQuery.rows[0]
}

const fetchAppsAccordToDate = async (query, selectStatement, conditionArr, conditionQueryArr) => {
    //verified condition params and query arrays
    let verifiedConditionParamsArr = []
    let verifiedConditionQueryArr = []
    for (let i = 0; i < conditionArr.length; i++) {
        if (conditionArr[i] !== "ALL") {
            verifiedConditionParamsArr.push(conditionArr[i])
            verifiedConditionQueryArr.push(conditionQueryArr[i])
        }
    }
    const queryString = queryConstructorDate(selectStatement, verifiedConditionQueryArr)
    // console.log(queryString, "\n", verifiedConditionParamsArr)
    const dbQuery = await pool.query(queryString, verifiedConditionParamsArr)

    // if query is details, return the entire array of objects, else return only the object in the array.
    return query === "details" ? dbQuery.rows : dbQuery.rows[0]
}

// MAIN ENTRY FUNCTION
const getDealerApplications = async (query, date = "ALL", userID, status = "ALL", service = "ALL") => {
    // Functions that return an early results according to a special condition
    if (service === "MAP")
        return mapAppsAccordToServices(userID, date)
    if (service === "diger")
        return fetchDigerServices(userID)
    // SELECT statements
    const selectCount = "SELECT count(*) FROM sales_applications INNER JOIN sales_applications_details ON sales_applications.id=sales_applications_details.id"
    const selectDetails = "SELECT sales_applications.id, sales_applications.client_name, sales_applications.submit_time, sales_applications_details.selected_service AS service_id, services.name AS service_name, sales_applications_details.selected_offer AS offer_id, offers.name AS offer_name, sales_applications_details.description, sales_applications.status, sales_applications_details.sales_rep_details, sales_applications_details.status_change_date, sales_applications_details.final_sales_rep_details, sales_applications.last_change_date, sales_applications_details.image_urls FROM sales_applications INNER JOIN sales_applications_details ON sales_applications.id=sales_applications_details.id INNER JOIN services ON services.service_id = sales_applications_details.selected_service INNER JOIN offers ON offers.offer_id = sales_applications_details.selected_offer"
    const selectStatement = query === "details" ? selectDetails : selectCount

    //CONDITION statements
    const conditionSubmitter = "sales_applications.submitter = "
    const conditionStatus = "sales_applications.status = "
    const conditionService = "sales_applications_details.selected_service = "

    // IF user is querying as an interval(day, month, year)...
    if (typeof date === "string" ||typeof date === "number") {
        const interval = date
        const conditionTime = convertDateInputToSQLInterval(interval)

        // I created this object so that, when I loop in the queryConstructor function, I can add dollar signs parameters on statements
        // that contain a nested select eg: (SELECT something FROM othertable WHERE ID = (SELECT something FROM othertable2))
        const intervalConditionObj = {statement: conditionTime, nestedSelect: false}
        const userIDConditionObj = {statement: conditionSubmitter, nestedSelect: false}
        const statusConditionObj = {statement: conditionStatus, nestedSelect: false}
        const serviceConditionObj = {statement: conditionService, nestedSelect: false}

        const conditionArr = [interval, userID, status, service]
        const conditionQueryArr = [intervalConditionObj, userIDConditionObj, statusConditionObj, serviceConditionObj]
        return fetchAppsAccordToInterval(query, interval, selectStatement, conditionArr, conditionQueryArr)
    } else { // ELSE if user is querying as an exact date with month and year format...
        let [day, month, year] = verifyDateValues(date)
        const extractMonthCondition = "EXTRACT(MONTH FROM sales_applications.submit_time) = "
        const extractYearCondition = "EXTRACT(YEAR FROM sales_applications.submit_time) = "
        const extractDayCondition = "EXTRACT(DAY FROM sales_applications.submit_time) = "


        const conditionArr = [day, month, Number(year), userID, status, service]
        const conditionQueryArr = [extractDayCondition, extractMonthCondition, extractYearCondition, conditionSubmitter, conditionStatus, conditionService]
        return fetchAppsAccordToDate(query, selectStatement, conditionArr, conditionQueryArr)
    }
}

const getServices = async () => {
    const servicesQueryStatement = "SELECT name FROM services WHERE active = true AND profitable = true"
    // Get the services
    const servicesQuery = await pool.query(servicesQueryStatement)
    // Map the values to make services array
    const services = servicesQuery.rows.map(obj => {
        return obj.name
    })
    return services
}

const getSdUsers = async (name, res) => {
    try {
        getUsersQueryStatement = "SELECT name, TO_CHAR(register_date,'YYYY-MM-DD') AS register_date, active, role, balance FROM login WHERE assigned_area = (SELECT assigned_area FROM login WHERE name = $1)"
        const getUsersAccordToResponibleArea = await pool.query(getUsersQueryStatement, [name])
        return res.status(200).json(getUsersAccordToResponibleArea.rows)
    } catch (err) {
        return status500Error(err, res, "server error could not fetch dealer users")
    }
}

const getSdcUsers = async (res) => {
    try {
        getUsersQueryStatement = "SELECT name, user_id, TO_CHAR(register_date,'YYYY-MM-DD') AS register_date, active, role, balance FROM login"
        const getUserQuery = await pool.query(getUsersQueryStatement)
        return res.status(200).json(getUserQuery.rows)
    } catch (err) {
        return status500Error(err, res, "server error could not fetch dealer users")
    }
}

const getSdUser = async (requesterID, userID, res) => {
    try {
        getUsersQueryStatement = "SELECT name, TO_CHAR(register_date,'YYYY-MM-DD') AS register_date, active, role, assigned_area, balance FROM login WHERE assigned_area = (SELECT assigned_area FROM login WHERE user_id = $1) AND user_id = $2"
        const getUsersAccordToResponibleArea = await pool.query(getUsersQueryStatement, [requesterID, userID])
        if (getUsersAccordToResponibleArea.rows.length === 0) {
            const errorStr = "SD queried ID '" + userID + "' but no such id exist or SD does not have permission"
            return customStatusError(errorStr, res, 400, "user does not exist or you do not have permission")
        }
        return res.status(200).json(getUsersAccordToResponibleArea.rows)
    } catch (err) {
        return status500Error(err, res, "server error could not fetch dealer user")
    }
}

const getSdcUser = async (userID, res) => {
    try {
        getUsersQueryStatement = "SELECT name, user_id, TO_CHAR(register_date,'YYYY-MM-DD') AS register_date, active, role, assigned_area, balance FROM login WHERE user_id = $1"
        const getUserQuery = await pool.query(getUsersQueryStatement, [userID])
        if (getUserQuery.rows.length === 0) {
            const errorStr = "SDC queried ID '" + userID + "' but no such id exist"
            return customStatusError(errorStr, res, 400, "user does not exist")
        }
        return res.status(200).json(getUserQuery.rows)
    } catch (err) {
        return status500Error(err, res, "server error could not fetch dealer user")
    }
}

module.exports = {
    getDealerApplications,
    getServices,
    getSdUsers,
    getSdcUsers,
    getSdUser,
    getSdcUser
}