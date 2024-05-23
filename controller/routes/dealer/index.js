const fs = require('fs')
const express = require('express')
const path = require('path')
const multer = require('multer')
const cloudinary = require('cloudinary').v2
const pool = require('../../database')
const uniqid = require('uniqid')
const { authenticateToken } = require('../../helpers/middleware')
const {
    sendApplication,
    verifyApplicationInput,
    getSaleActivator,
} = require('./functions')
const {
    status500Error,
    customStatusError,
    verifyReqObjExpectedObjKeys,
} = require('../../helpers/functions')
const { verifyReqBodyObjValuesNotEmpty } = require('../../helpers/middleware')

const imageStorage = multer.diskStorage({
    // Destination to store image
    destination: 'controller/routes/dealer/temp/',
    filename: (req, file, cb) => {
        const imageUniqID = `${Date.now()}-${uniqid.process()}`
        cb(
            null,
            file.fieldname +
                '_yoyo_' +
                imageUniqID +
                path.extname(file.originalname)
        )
    },
})
const upload = multer({
    storage: imageStorage,
    limits: {
        fileSize: 1500000, // 1000000 Bytes = 1 MB
    },
    fileFilter(req, file, cb) {
        // console.log("multer -- req: ", req)
        // console.log("multer -- file: ", file)
        if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
            return cb(new Error('Please upload an Image'))
        }
        cb(undefined, true)
    },
})

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

const app = (module.exports = express())

app.post(
    '/applications',
    authenticateToken,
    verifyReqBodyObjValuesNotEmpty,
    upload.array('image', 3),
    async (req, res) => {
        try {
            const expectedObjKeys = [
                'selectedService',
                'selectedOffer',
                'clientDescription',
                'clientName',
            ]
            console.info('Verifying object keys: ', expectedObjKeys)
            verifyReqObjExpectedObjKeys(expectedObjKeys)
            console.info('Object keys verified successfully')

            // verify all the input coming from request object
            console.info('Verifying application input: ', req.body)
            const verfiyAppInput = await verifyApplicationInput(req.body)
            if (verfiyAppInput.ok === false)
                return customStatusError(
                    verfiyAppInput.error,
                    res,
                    verfiyAppInput.statusCode,
                    verfiyAppInput.resString
                )
            console.info('Application input verified successfully')

            const userInfo = res.locals.userInfo
            if (userInfo.role !== 'dealer')
                return customStatusError(
                    'user does not have premission to submit',
                    res,
                    401,
                    'user does not have premission to submit'
                )
            console.info('User has permission to submit application')

            // Get the current highest application ID, to insert it into the file name when it's uploaded to cloudinary
            console.info('Getting the current highest application ID')
            const highestApplicationIDQuery = await pool.query(
                'SELECT MAX(id) FROM sales_applications;'
            )
            const highestApplicationID = highestApplicationIDQuery.rows[0].max
            console.info('Current highest application ID: ', highestApplicationID)

            console.info('Uploading images to cloudinary.')
            console.info('- dirname: ', __dirname)
            console.info('- temp: ', __dirname + '/temp')
            const imageFolderPath = path.join(__dirname + '/temp')
            console.info('image folder path: ', imageFolderPath)
            const dbImageURLS = []
            fs.readdir(imageFolderPath, (err, filePaths) => {
                if (err)
                    return status500Error(
                        err,
                        res,
                        'An error occurred while uploading your application'
                    )
                console.info('filePaths: ', filePaths)
                for (let i = 0; i < filePaths.length; i++) {
                    const file = __dirname + '/temp/' + filePaths[i]
                    const uploadOptions = {
                        public_id: `iys/dealer_submissions/${
                            userInfo.userID
                        }/${highestApplicationID}/${filePaths[i]
                            .split('.')
                            .slice(0, -1)
                            .join('.')}`,
                    }
                    console.info('- uploading to cloudinary.')
                    console.info('- file: ', file)
                    console.info('- uploadOptions: ', uploadOptions)
                    cloudinary.uploader.upload(
                        file,
                        uploadOptions,
                        async (err, result) => {
                            if (err) {
                                return status500Error(
                                    err,
                                    res,
                                    'An error occurred while uploading your application'
                                )
                            } else {
                                console.info('-> upload successfull! result: ', result)
                                dbImageURLS.push(result.secure_url)
                                console.info('-> removing file from temp folder.')
                                fs.unlink(
                                    __dirname + '/temp/' + filePaths[i],
                                    async (err) => {
                                        if (err)
                                            return status500Error(
                                                err,
                                                res,
                                                'An error occurred while uploading your application'
                                            )
                                        if (dbImageURLS.length === 3) {
                                            console.info('-> all images uploaded successfully, sending application...')
                                            return await sendApplication(
                                                userInfo,
                                                req.body,
                                                dbImageURLS,
                                                res
                                            )
                                        }
                                    }
                                )
                            }
                        }
                    )
                }
                // return res.status(200).json("an error occurred during application submission")
            })
        } catch (error) {
            console.error(error)
            return res.status(500)
        }
    }
)

app.get('/balance', authenticateToken, async (req, res) => {
    const { userInfo } = res.locals
    try {
        const query = await pool.query(
            'SELECT balance FROM login WHERE user_id = $1',
            [userInfo.userID]
        )
        return res.status(200).json(query.rows[0])
    } catch (err) {
        return status500Error(
            err,
            res,
            'server error could not fetch your balance'
        )
    }
})

app.get('/activator', authenticateToken, async (req, res) => {
    const { userInfo } = res.locals
    try {
        const { name: activatorName } = await getSaleActivator(
            userInfo.userID,
            res
        )
        return res.status(200).json({ name: activatorName })
    } catch (err) {
        return status500Error(
            err,
            res,
            'server error could not fetch your balance'
        )
    }
})
