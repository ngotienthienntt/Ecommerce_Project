"use strict"
const express = require("express");
const router = express.Router();
const notiController = require("../../controllers/notification.controller");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authenticationV2 } =  require("../../auth/authUtils")

//here noti isn't login

//authentication
router.use(authenticationV2);

router.get("", asyncHandler(notiController.listNotiByUser));

module.exports = router;