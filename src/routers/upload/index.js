"use strict"
const express = require("express");
const router = express.Router();
const uploadController = require("../../controllers/upload.controller");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authenticationV2 } =  require("../../auth/authUtils")
const { uploadDisk, uploadMemory } = require("../../configs/config.multer")

//get amount discount
////
// router.use(authenticationV2);
router.post("/product", asyncHandler(uploadController.uploadFile));
router.post("/product/thumb", uploadDisk.single('file') ,asyncHandler(uploadController.uploadFileThumb));

router.post("/product/bucket", uploadMemory.single('file'), asyncHandler(uploadController.uploadFileLocalS3));

module.exports = router;