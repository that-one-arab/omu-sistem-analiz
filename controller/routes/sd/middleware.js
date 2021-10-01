const { customStatusError } = require("../../helpers/functions")
const pool = require("../../database")

const verifyUpdateApplication = async (req, res, next) => {
    const userRole = "sales_assistant_chef"
    const name = "Erdem Mutlu"
    // const { userRole, name } = res.locals.userInfo
    // if user does not have the appropriate role to update an application
    if (userRole !== "sales_assistant" && userRole !== "sales_assistant_chef")
        return customStatusError("submitted request does not have SD or SDC role", res, 401, "You are not authorized to update applications")

    const { applicationID } = req.params
    // if application does not exist in database
    verifyAppIDQuery = await pool.query("SELECT id, status, activator FROM sales_applications WHERE id = $1", [applicationID])
    if (typeof verifyAppIDQuery.rows[0]?.id !== "number")
        return customStatusError(
            "requested ID '" + applicationID + "' does not exist in database at "+__dirname, 
            res, 
            401, 
            "This application ID does not exist"
        )
    // if application's status is 'approved' or 'rejected' and can not make further changes to it
    if (verifyAppIDQuery.rows[0]?.status === "approved" || verifyAppIDQuery.rows[0]?.status === "rejected")
    return customStatusError(
            "requested application with ID '" + applicationID + "' is approved or rejected, can not make further changes at "+__dirname, 
            res, 
            401, 
            "You can not make further changes to this application"
        )
    // if request body statusChange field's value has unexpected input
    const expectedStatusChange = ["processing", "rejected", "approved"]
    if (!expectedStatusChange.includes(req.body.statusChange))
        return customStatusError(
            "requested application with ID '" + applicationID + "' has an unexpected req.body.statusChange field input at "+__dirname,
            res,
            401,
            "Unexpected input"
        )
    // if the user submitted the update request is not the responsible activator
    if (verifyAppIDQuery.rows[0]?.activator !== name)
        return customStatusError(
            "application ID '" + applicationID + "' with activator '" + verifyAppIDQuery.rows[0]?.activator +  "' tried to be updated by user '" + name + "'  at "+__dirname,
            res,
            401,
            "You are not the activator responsible for updating this application"
        )
    //if all verifications pass
    const appID = verifyAppIDQuery.rows[0].id
    const currentStatus = verifyAppIDQuery.rows[0].status
    res.locals.updateAppQuery = {
        appID,
        currentStatus
    }
    next()
}

module.exports = {
    verifyUpdateApplication
}