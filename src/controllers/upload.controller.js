"use strict"
const { OK } = require("../core/success.response");
const { BadRequestError } = require("../core/error.response")
const { uploadImageFromUrl, uploadImageFromLocal } = require("../services/upload.service")
const { uploadImageFromLocalS3 } = require("../services/uploadAWS.service")


class UploadController {
    uploadFile = async (req, res, next) => {
            const result = await uploadImageFromUrl()
            new OK({
                message: "upload image success",
                metadata: result
            }).send(res);
    }

    uploadFileThumb = async (req, res, next) => {
        const { file } = req
        if(!file){
            throw new BadRequestError("File missing")
        }
        const result = await uploadImageFromLocal({
            path: file.path 
        })
        new OK({
            message: "upload image success",
            metadata: result
        }).send(res);
    }

    uploadFileLocalS3 = async (req, res, next) => {
        const { file } = req
        if(!file){
            throw new BadRequestError("File missing")
        }
        const result = await uploadImageFromLocalS3({
            file
        })
        new OK({
            message: "upload image s3 success",
            metadata: result
        }).send(res);
    }

}

module.exports = new UploadController()