const fs = require('fs')
const express = require('express')
const path = require('path')
const multer = require('multer')
const cloudinary = require('cloudinary').v2
const pool = require('../../database')
const uniqid = require('uniqid')
const { authenticateToken } = require('../../helpers/middleware')
const { sendApplication, verifyApplicationInput, getSaleActivator } = require('./functions')
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
            verifyReqObjExpectedObjKeys([
                'selectedService',
                'selectedOffer',
                'clientDescription',
                'clientName',
            ])

            // verify all the input coming from request object
            const verfiyAppInput = await verifyApplicationInput(req.body)
            if (verfiyAppInput.ok === false)
                return customStatusError(
                    verfiyAppInput.error,
                    res,
                    verfiyAppInput.statusCode,
                    verfiyAppInput.resString
                )

            const userInfo = res.locals.userInfo
            if (userInfo.role !== 'dealer')
                return customStatusError(
                    'user does not have premission to submit',
                    res,
                    401,
                    'user does not have premission to submit'
                )
            // Get the current highest application ID, to insert it into the file name when it's uploaded to cloudinary
            const highestApplicationIDQuery = await pool.query(
                'SELECT MAX(id) FROM sales_applications;'
            )
            const highestApplicationID = highestApplicationIDQuery.rows[0].max

            const imageFolderPath = path.join(__dirname + '/temp')
            const dbImageURLS = []
            fs.readdir(imageFolderPath, (err, filePaths) => {
                if (err)
                    return status500Error(
                        err,
                        res,
                        'An error occurred while uploading your application'
                    )
                for (let i = 0; i < filePaths.length; i++) {
                    cloudinary.uploader.upload(
                        __dirname + '/temp/' + filePaths[i],
                        {
                            public_id: `iys/dealer_submissions/${
                                userInfo.userID
                            }/${highestApplicationID}/${filePaths[i]
                                .split('.')
                                .slice(0, -1)
                                .join('.')}`,
                        },
                        async (err, result) => {
                            if (err) {
                                return status500Error(
                                    err,
                                    res,
                                    'An error occurred while uploading your application'
                                )
                            } else {
                                console.log(result)
                                dbImageURLS.push(result.secure_url)
                                fs.unlink(
                                    __dirname + '/temp/' + filePaths[i],
                                    async (err) => {
                                        if (err)
                                            return status500Error(
                                                err,
                                                res,
                                                'An error occurred while uploading your application'
                                            )
                                        if (dbImageURLS.length === 3)
                                            return await sendApplication(
                                                userInfo,
                                                req.body,
                                                dbImageURLS,
                                                res
                                            )
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
        const activatorName = await getSaleActivator(userInfo.userID, res)
        return res.status(200).json({name: activatorName})
    } catch (err) {
        return status500Error(
            err,
            res,
            'server error could not fetch your balance'
        )
    }
})
