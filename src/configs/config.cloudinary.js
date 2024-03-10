"use strict"

// Require the cloudinary library
const cloudinary = require('cloudinary').v2;

// Return "https" URLs by setting secure: true
// write config in env
cloudinary.config({
  cloud_name: "shopdevthienngo",
  api_key: "813442593189282",
  api_secret: "JXu9uqIvI7xZNJRWPIhpoBGC_Zg"
});

module.exports = cloudinary