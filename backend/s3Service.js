const { S3 } = require("aws-sdk") //V2
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3")
const uuid = require("uuid").v4

// Uploading images to S3 using  the AWS SDK V2
exports.s3UploadV2 = async (files) => {
    const s3 = new S3()
    const params = files.map(file => {
        return {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key:  `uploads/${uuid()}-${file.originalname}`,
            Body: file.buffer,
        };
    });

    return await  Promise.all(params.map(param => s3.upload(param).promise()));
}


// Uploading images to S3 using  the AWS SDK V3
exports.s3UploadV2 = async (files) => {
    const s3 = new S3()
    const params = files.map(file => {
        return {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key:  `uploads/${uuid()}-${file.originalname}`,
            Body: file.buffer,
        };
    });

    return await  Promise.all(params.map(param => s3.upload(param).promise()));
}

// exports.s3UploadV3 = async  (file) => {
//     try{
//         const s3client = new  S3Client()
//         const param = {
//             Bucket: process.env.AWS_BUCKET_NAME,
//             Key:  `uploads/${uuid()}-${file.originalname}`,
//             Body: file.buffer,
//         };
//         return s3client.send(new PutObjectCommand(param));
//     } catch (err){
//         console.log('Error uploading image to S3', err);
//     }
// }
exports.s3UploadV3 = async  (files) => {
    const s3client = new  S3Client()
    const params = files.map(file => {
        return {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key:  `uploads/${uuid()}-${file.originalname}`,
            Body: file.buffer,
        };
    });

    return await  Promise.all(params.map(param => s3client.send(new PutObjectCommand(param))));
}
