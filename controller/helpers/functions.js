const uniqid = require('uniqid')
const pool = require('../database')

const status500Error = (error, res, resErrorString) => {
    console.log(error)
    const errorDate = new Date()
    const errorID = uniqid('ERROR-ID-')
    console.log('-*-*-*-' + errorID + ' DATE: ', errorDate)
    return res.status(500).json(resErrorString + ' ' + errorID)
}
const customStatusError = (error, res, resStatus, resErrorString) => {
    console.log(error)
    const errorDate = new Date()
    const errorID = uniqid('ERROR-ID-')
    console.log('-*-*-*-' + errorID + ' DATE: ', errorDate)
    return res.status(resStatus).json(errorID + ' ' + resErrorString)
}
// A function that compares two arrays to check if they have equal values(regardles
// of different sorting ) I recall using it for verifyObjKeys function.
const arrayCompare = (_arr1, _arr2) => {
    if (
        !Array.isArray(_arr1) ||
        !Array.isArray(_arr2) ||
        _arr1.length !== _arr2.length
    ) {
        return false
    }

    // .concat() to not mutate arguments
    const arr1 = _arr1.concat().sort()
    const arr2 = _arr2.concat().sort()

    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) {
            return false
        }
    }

    return true
}

const verifyReqObjExpectedObjKeys = (objKeysArr, reqObj) => {
    let requestObjArr = []
    for (const key in reqObj) {
        requestObjArr.push(key)
    }
    if (!arrayCompare(requestObjArr, objKeysArr)) {
        const errorStr = `Expected object keys: { ${objKeysArr} } GOT: { ${requestObjArr} } at ${__dirname}`
        return {
            ok: false,
            error: errorStr,
            statusCode: 406,
            resString: 'Unexpected input',
        }
    }
    return {
        ok: true,
    }
}

const verifyInputNotEmptyFunc = (reqObj) => {
    const errorStr = `verifyInputNotEmptyFunc returned 'one of the object's values was empty'`
    if (!reqObj)
        return {
            ok: false,
            error: errorStr,
            statusCode: 406,
            resString: 'One of your inputs was empty',
        }
    const reqObjArr = Object.values(reqObj)
    for (let i = 0; i < reqObjArr.length; i++) {
        if (reqObjArr[i].trim() === '') {
            return {
                ok: false,
                error: errorStr,
                statusCode: 406,
                resString: 'One of your inputs was empty',
            }
        }
    }
    return {
        ok: true,
    }
}

const switchServiceNameToTurkish = async (serviceEngEquivalent) => {
    if (serviceEngEquivalent === 'ALL') return serviceEngEquivalent
    const getServiceStatement =
        'SELECT name FROM services WHERE eng_equivalent = $1'
    const query = await pool.query(getServiceStatement, [serviceEngEquivalent])
    return query.rows[0].name
}

// a query constructor specific to DATE queries
const queryConstructorDate = (selectStatement, conditionArr) => {
    let conditionText = ''
    for (let i = 0; i < conditionArr.length; i++) {
        if (i === 0) conditionText = ` WHERE ${conditionArr[i]} $${i + 1}`
        else
            conditionText =
                conditionText + ' AND ' + conditionArr[i] + `$${i + 1}`
    }
    return selectStatement + conditionText
}

const verifyUserAndReturnInfo = async (userID) => {
    const query = await pool.query(
        'SELECT name, hash, role, active, register_date, user_id, email, name, assigned_area FROM login WHERE user_id = $1',
        [userID]
    )
    if (query.rows.length === 0) return {}
    return query.rows[0]
}

// returns a lowercased string that had it's turkish characters replaced with english ones
const replaceTURCharWithENG = (string) => {
    const turkishCharactersArray = [
        'İ',
        'ı',
        'Ö',
        'ö',
        'Ü',
        'ü',
        'Ç',
        'ç',
        'Ğ',
        'ğ',
        'Ş',
        'ş',
    ]
    const englishEquivilant = [
        'I',
        'i',
        'O',
        'o',
        'U',
        'u',
        'C',
        'c',
        'G',
        'g',
        'S',
        's',
    ]
    const strArray = string.split('')
    let newStr = ''

    for (let i = 0; i < strArray.length; i++) {
        let tempStr = []
        for (let j = 0; j < turkishCharactersArray.length; j++) {
            if (strArray[i] === turkishCharactersArray[j]) {
                tempStr.push(englishEquivilant[j])
            }
        }
        if (tempStr.length !== 0) newStr = newStr + tempStr[0]
        else newStr = newStr + strArray[i]
        tempStr.splice(0, tempStr.length)
    }
    return newStr.toLowerCase()
}

// *** DEPRECATED FUNCTION *** //
// const verifyServiceNameFromInput = async (service = undefined, serviceEng = undefined, ID = undefined) => {
//     let errorStr = ""
//     let query
//     if (service) {
//         errorStr = "service name '" + service + "' does not exist in database"
//         query = await pool.query("SELECT name FROM services WHERE name = $1", [service])
//     }
//     else if (ID) {
//         errorStr = "service ID '" + ID + " does not exist in database"
//         query = await pool.query("SELECT service_id FROM services WHERE service_id = $1", [ID])
//     }
//     else {
//         errorStr = "service name's english equivalent '" + serviceEng + " does not exist in database"
//         query = await pool.query("SELECT eng_equivalent FROM services WHERE eng_equivalent = $1", [serviceEng])
//     }
//     if (query.rowCount === 0)
//         return {
//             ok: false,
//             error: errorStr,
//             statusCode: 406,
//             resString: "Service input does not exist in database"
//         }
//     return {ok: true}
// }

const verifyServiceIDFromInput = async (ID = undefined) => {
    let errorStr = ''
    let query = undefined
    if (ID !== undefined && typeof Number(ID) === 'number') {
        // prepare an error string in case of failure
        errorStr = "service ID '" + ID + ' does not exist in database'
        // run the query
        query = await pool.query(
            'SELECT service_id FROM services WHERE service_id = $1',
            [ID]
        )
        if (query.rowCount === 0)
            return {
                ok: false,
                error: errorStr,
                statusCode: 406,
                resString: 'Service ID does not exist in database',
            }
        return { ok: true }
    } else {
        errorStr =
            "Expected type number for service ID instead got '" + ID + "'"
        return {
            ok: false,
            error: errorStr,
            statusCode: 406,
            resString: 'Unexpected input for service field',
        }
    }
}

// *** DEPRECATED FUNCTION *** //
// const verifyOfferFromInput = async (offer = undefined, ID = undefined) => {
//     let errorStr = ""
//     let query
//     if (offer) {
//         errorStr = "offer name '" + offer + " does not exist in database"
//         query = await pool.query("SELECT name FROM offers WHERE name = $1", [offer])
//     }
//     else {
//         errorStr = "offer ID '" + ID + " does not exist in database"
//         query = await pool.query("SELECT offer_id FROM services WHERE offer_id = $1", [ID])
//     }
//     if (query.rowCount === 0)
//         return {
//             ok: false,
//             error: errorStr,
//             statusCode: 406,
//             resString: "Offer input does not exist in database"
//         }
//     return {ok: true}
// }

const verfiyOfferIDFromInput = async (ID = undefined) => {
    let errorStr = ''
    let query = undefined
    if (ID !== undefined && typeof Number(ID) === 'number') {
        // prepare an error string in case of failure
        errorStr = "offer ID '" + ID + ' does not exist in database'
        // run the query
        query = await pool.query(
            'SELECT offer_id FROM offers WHERE offer_id = $1',
            [ID]
        )
        if (query.rowCount === 0)
            return {
                ok: false,
                error: errorStr,
                statusCode: 406,
                resString: 'Offer ID does not exist in database',
            }
        return { ok: true }
    } else {
        errorStr = "Expected type 'number' for offer ID instead got '" + ID
        return {
            ok: false,
            error: errorStr,
            statusCode: 406,
            resString: 'Unexpected input for offer field',
        }
    }
}

module.exports = {
    status500Error,
    customStatusError,
    verifyReqObjExpectedObjKeys,
    verifyInputNotEmptyFunc,
    queryConstructorDate,
    switchServiceNameToTurkish,
    verifyUserAndReturnInfo,
    replaceTURCharWithENG,
    verifyServiceIDFromInput,
    verfiyOfferIDFromInput,
}
