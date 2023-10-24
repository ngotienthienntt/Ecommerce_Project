'use strict'
const express = require('express');
const router = express.Router();
const { apiKey, permission } = require("../auth/checkAuth");


//1. check apikey
router.use(apiKey)
//2. check permission
router.use(permission("0000"))

router.use("/v1/api/auth", require("./access"));
router.use("/v1/api/product", require("./product"));
router.use("/v1/api/discount", require("./discount"));

module.exports = router;