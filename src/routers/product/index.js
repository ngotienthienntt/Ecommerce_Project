"use strict"
const express = require("express");
const router = express.Router();
const productController = require("../../controllers/product.controller");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authenticationV2 } =  require("../../auth/authUtils")

router.get("/search/:keySearch", asyncHandler(productController.getlistSearchProduct));
router.get("", asyncHandler(productController.findAllProducts));
router.get("/:id", asyncHandler(productController.findProduct));

//authentication
router.use(authenticationV2);
////
router.post("", asyncHandler(productController.createProduct));
router.post("/publish/:id", asyncHandler(productController.publishProductByShop));
router.post("/un-publish/:id", asyncHandler(productController.unpublishProductByShop));
router.get("/drafts/all", asyncHandler(productController.getAllDraftsForShop));
router.get("/published/all", asyncHandler(productController.getAllPublishsForShop));


module.exports = router;