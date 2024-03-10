const { s3, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require("../configs/config.s3")
const crypto = require("crypto")
// const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { getSignedUrl } = require("@aws-sdk/cloudfront-signer")
const urlImagePublic = "https://d8cv3vtdcvjox.cloudfront.net"
//2. upload from image local
const uploadImageFromLocalS3 = async ({file}) => {
    try{
        const randomName = () => crypto.randomBytes(16).toString('hex')
        const imageName = randomName();
        const command = new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: imageName,
            Body: file.buffer,
            ContentType: "image/jpeg"
        })

        const result = await s3.send(command);
        console.log("result: ", result);

        // const signedUrl = new GetObjectCommand({
        //     Bucket: process.env.AWS_BUCKET_NAME,
        //     Key: imageName
        // })

        // const url = await getSignedUrl(s3, signedUrl, { expiresIn: 3600 });
        const url = getSignedUrl({
            url: `${urlImagePublic}/${imageName}`,
            keyPairId: "K3L78S956W82PT",
            dateLessThan: new Date(Date.now() + 1000 * 60),
            privateKey: process.env.AWS_BUCKET_PUBLIC_KEY_ID,
          });
        console.log("url:::", url)
        return {
            url,
            result
        }
    }catch(e){
        console.log("upload file error: ", e)
    }
}

module.exports = {
    uploadImageFromLocalS3
}