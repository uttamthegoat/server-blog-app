const express = require("express");
const { imageUpload } = require("../controllers/imageUpload");
const router = express.Router();
const multer = require("multer");
const upload = multer();
const confirmAuth = require("../middleware/confirmAuth");

// handle image upload
router.route("/image-upload").post(confirmAuth,upload.single("file"), imageUpload);

module.exports = router;
