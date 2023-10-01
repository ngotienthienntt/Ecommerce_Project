'use strict'
const express = require('express');
const router = express.Router();
const { apiKey, permission } = require("../auth/checkAuth");

//1. check apikey
router.use(apiKey)
//2. check permission
router.use(permission("0000"))


router.use("/v1/api", require("./access"));

module.exports = router;