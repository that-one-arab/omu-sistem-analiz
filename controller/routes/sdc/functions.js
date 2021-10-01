const pool = require("../../database");

const verifyDateNotOlderThanCurnt = (date) => {
    const tempInputDate = new Date(date);
    const tempInputDateString = `${tempInputDate.getFullYear()}-${tempInputDate.getMonth()+1}`
    const inputDate = new Date(tempInputDateString);
    
    const tempCurntDate = new Date()
    const tempCurntDateString = `${tempCurntDate.getFullYear()}-${tempCurntDate.getMonth()+1}`
    const currentDate = new Date(tempCurntDateString)
    const errInputDateOlder = "input date '" + tempInputDateString + "' is older than current date '" + tempCurntDateString
    if (currentDate.setHours(0, 0, 0, 0) <= inputDate.setHours(0, 0, 0, 0)) 
        return {
            ok: true,
            verifiedDate: `${tempInputDateString}-${inputDate.getDate()}`
        }
    else 
        return {
            ok: false,
            error: errInputDateOlder
        }
    }

const verifyGoalDoesNotExist = async (date, service, userID) => {
    const errorStr = "user input date '" + date + "' and service '" + service + "' for user ID '" + userID + "' already exists in database as"
    const tempInputDate = new Date(date);
    // outputs date year month according to input date, but it adds day: 01
    const inputDateString = `${tempInputDate.getFullYear()}-${tempInputDate.getMonth()+1}-01`
    const dateQueryStatement = "SELECT date_part('year', for_date), date_part('month', for_date) FROM goals WHERE for_date = $1 AND for_user_id = $2 AND service_id = $3"
    try {
        const dateQuery = await pool.query(dateQueryStatement, [inputDateString, userID, service])
        console.log(dateQuery.rowCount, typeof dateQuery.rowCount)
        if (dateQuery.rowCount !== 0)
            return {
                ok: false,
                error: errorStr,
                statusCode: 401
            }
        return {
            ok: true
        }
        
    } catch (error) {
        return {
            ok: false,
            error: error,
            statusCode: 500
        }
    }
}

module.exports = {
    verifyDateNotOlderThanCurnt,
    verifyGoalDoesNotExist
}