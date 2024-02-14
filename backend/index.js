require("dotenv").config();
const express = require('express');
const multer = require("multer");
const { s3UploadV2, s3UploadV3 } = require("./s3Service");
const uuid = require("uuid").v4

const app = express();

// Uploading a single image
// const upload = multer({dest: "uploads/"})
// app.post("/upload",  upload.single("file"), (req, res) => {
//     res.json({"success": "Success"});
// });

// // Uploading multiple images
// const upload = multer({dest: "uploads/"})
// app.post("/upload",  upload.array("file", 4), (req, res) => {
//     res.json({"success": "Success"});
// });


// Uploading multiple fields
// const upload = multer({dest: "uploads/"})
// const multiUpload = upload.fields([
//     {name:"avatar", maxCount: 1},
//     {name:"resume", maxCount: 1},

// ]);

// app.post("/upload",  multiUpload, (req, res) => {
//     console.log(req.files)
//     res.json({"success": "Success"});
// });

// // Uploading multiple images with custom filename

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, "uploads")
//     },
//     filename:(req, file, cb) => {
//         const {originalname} = file;
//         cb(null, `${uuid()}-${originalname}`)
//     }
// });

const storage = multer.memoryStorage()

const fileFilter = (req, file, cb)=>{
    // if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
    if(file.mimetype.split("/")[0] === 'image'){
        cb(null, true);
    } else {
        cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE"), false);
    }
};

// SDK V2
// const upload = multer(
//     {storage: storage, fileFilter: fileFilter, limits:{fileSize: 1000000, files: 2}})
// app.post("/upload",  upload.array("file"), async (req, res) => {
//     try  {
//         const results = await s3UploadV2(req.files);
//         console.log(results);
//         return res.json({"Status": "File has been uploaded successfully"});
//     } catch (err) {
//         console.log(err);
//       };
// });

// // sdk V3 one file
// const upload = multer(
//     {storage: storage, fileFilter: fileFilter, limits:{fileSize: 1000000}})
// app.post("/upload",  upload.array("file"), async (req, res) => {
//     const file =  req.files[0];
//     try  {
//         const results = await s3UploadV3(file);
//         console.log(results);
//         return res.json({"Status": "File has been uploaded successfully"});
//     } catch (err) {
//         console.log(err);
//       };
// });

// sdk V3 many files
const upload = multer(
    {storage: storage, fileFilter: fileFilter, limits:{fileSize: 1000000}})
app.post("/upload",  upload.array("file"), async (req, res) => {
    try  {
        const results = await s3UploadV3(req.files);
        console.log(results);
        return res.json({"Status": "File has been uploaded successfully"});
    } catch (err) {
        console.log(err);
      };
});


app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === "LIMIT_FILE_SIZE") {
            return res.status(413).send("Image size too large")};
        }

        if (error.code === "LIMIT_FILE_COUNT") {
            return res.status(413).send("Number of file limit to be uploaded exceeded")};

        if (error.code === "LIMIT_UNEXPECTED_FILE") {
            return res.status(413).send("File(s) must be image")};
})


app.listen(4000, () => console.log("listening on port 4000"));