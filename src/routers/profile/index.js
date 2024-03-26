"use strict"
const express = require("express");
const router = express.Router();
const { profiles, profile } = require("../../controllers/profile.controller")

//admin

router.get('viewAny', profiles)

//shop

router.get('viewOwn', profile)


module.exports = router;