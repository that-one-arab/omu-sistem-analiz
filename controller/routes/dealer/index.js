const fs = require("fs")
const express = require("express");
const path = require("path");
const multer = require("multer")
const cloudinary = require("cloudinary").v2
const pool = require("../../database");
const uniqid = require('uniqid');
const { authenticateToken } = require("../../helpers/middleware")
const { sendApplication, verifyApplicationInput } = require("./functions");
const { 
    status500Error, 
    customStatusError,
    verifyReqObjExpectedObjKeys
} = require("../../helpers/functions");
const { verifyReqBodyObjValuesNotEmpty } = require("../../helpers/middleware");

const imageStorage = multer.diskStorage({
    // Destination to store image     
    destination: 'controller/routes/dealer/temp/', 
      filename: (req, file, cb) => {
          cb(null, file.fieldname + '_yoyo_' + Date.now() 
             + path.extname(file.originalname))
    }
  });
const upload = multer({
    storage: imageStorage,
    limits: {
    fileSize: 1500000 // 1000000 Bytes = 1 MB
    },
    fileFilter(req, file, cb) {
    // console.log("multer -- req: ", req)
    // console.log("multer -- file: ", file)
    if (!file.originalname.match(/\.(png|jpg)$/)) { 
        return cb(new Error('Please upload an Image'))
        }
    cb(undefined, true)
    }
})

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});

const app = module.exports = express();

app.post("/applications", authenticateToken, verifyReqBodyObjValuesNotEmpty, upload.array("image", 3), async(req, res) => {
    try {
        verifyReqObjExpectedObjKeys(["selectedService", "selectedOffer", "clientDescription", "clientName"])
        // verify all the input coming from request object
        const verfiyAppInput = await verifyApplicationInput(req.body)
        if (verfiyAppInput.ok === false)
            return customStatusError(verfiyAppInput.error, res, verfiyAppInput.statusCode, verfiyAppInput.resString)
        
        const userInfo = res.locals.userInfo
        if (userInfo.role !== "dealer")
            return customStatusError("user does not have premission to submit", res, 401, "user does not have premission to submit")
        const { files } = req
        console.log(files)
        console.log(req.body)
        // Get the current highest application ID, to insert it into the file name when it's uploaded to cloudinary
        const highestApplicationIDQuery = await pool.query("SELECT MAX(id) FROM sales_applications;")
        const highestApplicationID = highestApplicationIDQuery.rows[0].max
        for (let i = 0; i < files.length; i++) {

            const fileExtension = path.extname(files[i].originalname).toLowerCase() 
            console.log("fileExtension", fileExtension)
            const imageUniqID = `${userInfo.userID}-${uniqid.process()}`
            console.log("imageUniqID", imageUniqID);
            fs.renameSync(`${files[i].path}`, `${files[i].destination}/${imageUniqID+fileExtension}`);
            console.log( `renamed to ${files[i].destination}/${imageUniqID+fileExtension}`)
        }
        const imageFolderPath = path.join(__dirname + "/temp")
        console.log('imageFolderPath', imageFolderPath)
        let dbImageURLS = []
        fs.readdir(imageFolderPath, (err, filePaths) => {
            console.log('in READDIR function...')
            if (err)
                return status500Error(err, res, "An error occurred while uploading your application")
            console.log('passed readdir function, moving onto cloudinary upload loop...')
            console.log("filePaths", filePaths)
            for (let i = 0; i < filePaths.length; i++) {
                console.log('in cloudinary upload loop number ', i)
                console.log('FILEPATH: ', __dirname + "/temp/" + filePaths[i])
                cloudinary.uploader.upload(__dirname + "/temp/" + filePaths[i], {
                     public_id: `iys/dealer_submissions/${userInfo.userID}/${highestApplicationID}/${filePaths[i].split('.').slice(0, -1).join('.')}`
                    }, async (err, result) => {
                    if (err) {
                        return status500Error(err, res, "An error occurred while uploading your application")
                    }
                    else {
                        console.log(result); 
                        dbImageURLS.push(result.secure_url)
                        console.log('deleting from storage...')
                        fs.unlink(__dirname + "/temp/" + filePaths[i], async err => {
                        if (err)
                            return status500Error(err, res, "An error occurred while uploading your application")
                        console.log('deleted')
                        console.log("dbImageURLS", dbImageURLS)
                        if (dbImageURLS.length === 3)
                            await sendApplication(userInfo, req.body, dbImageURLS, res)
                        });
                    }
                });
            }
            // return res.status(200).json("an error occurred during application submission")
        })

    } catch (error) {
        console.error(error)
        res.status(500)
    }
})

app.get("/balance", authenticateToken, async (req, res) => {
    const { userInfo } = res.locals
    try {
        const query = await pool.query("SELECT balance FROM login WHERE user_id = $1", [userInfo.userID])
        return res.status(200).json(query.rows[0])
    } catch (err) {
        return status500Error(err, res, "server error could not fetch your balance")
    }
})

app.get("/activator", authenticateToken, async (req, res) => {
    const { userInfo } = res.locals
    try {
        const query = await pool.query("SELECT name FROM login WHERE assigned_area = (SELECT assigned_area FROM login WHERE user_id = $1)", [userInfo.userID])
        return res.status(200).json(query.rows[0])
    } catch (err) {
        return status500Error(err, res, "server error could not fetch your balance")
    }
})