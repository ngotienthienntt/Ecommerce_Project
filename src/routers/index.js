'use strict'
const express = require('express');
const router = express.Router();
const { apiKey, permission } = require("../auth/checkAuth");
// const { pushToLogDiscord } = require("../middlewares")


//1. check apikey
router.use(apiKey)
//2. check permission
router.use(permission("0000"))

//3. add log
// router.use(pushToLogDiscord)

router.use("/v1/api/checkout", require("./checkout"));
router.use("/v1/api/inventory", require("./inventory"));
router.use("/v1/api/profile", require("./profile"));
router.use("/v1/api/auth", require("./access"));
router.use("/v1/api/product", require("./product"));
router.use("/v1/api/upload", require("./upload"));
router.use("/v1/api/discount", require("./discount"));
router.use("/v1/api/comment", require("./comment"));
router.use("/v1/api/cart", require("./cart"));
router.use("/v1/api/notification", require("./notification"));

module.exports = router;