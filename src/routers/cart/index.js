"use strict"
const express = require("express");
const router = express.Router();
const cartController = require("../../controllers/cart.controller");
const { asyncHandler } = require("../../helpers/asyncHandler");
// const { authenticationV2 } =  require("../../auth/authUtils")

//get amount discount
////
router.post("", asyncHandler(cartController.addToCart));
router.delete("", asyncHandler(cartController.delete));
router.post("/update", asyncHandler(cartController.update));
router.get("", asyncHandler(cartController.listToCart));



module.exports = router;