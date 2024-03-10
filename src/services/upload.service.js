"use strict"

const cloudinary = require("../configs/config.cloudinary")

//1. upload from url image

const uploadImageFromUrl = async () => {
    try{
        const urlImage = "https://buffer.com/cdn-cgi/image/w=1000,fit=contain,q=90,f=auto/library/content/images/size/w600/2023/10/free-images.jpg"
        const folderName = "product/shopId", newFileName = "testdemo1"
        const result = await cloudinary.uploader.upload(urlImage, {
            folder: folderName
        })
 
        console.log(result)
        return result 
    }catch(e){
        console.log("upload file error: ", e)
    }
}

//2. upload from image local
const uploadImageFromLocal = async ({path, folderName = "product/8409"}) => {
    try{
        const result = await cloudinary.uploader.upload(path, {
            public_id: "thump",
            folder: folderName
        })

        console.log(result)
        return {
            image_url: result.secure_url,
            shopId: 8409,
            thumb_url: await cloudinary.url(result.public_id, {
                height: 100,
                width: 100,
                format: "jpg"
            })
        } 
    }catch(e){
        console.log("upload file error: ", e)
    }
}

module.exports = {
    uploadImageFromUrl,
    uploadImageFromLocal
}