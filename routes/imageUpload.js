const express = require("express");
const {
  imageUploadUser,
  imageUploadPost,
} = require("../controllers/imageUpload");
const router = express.Router();
const multer = require("multer");
const upload = multer();
const confirmAuth = require("../middleware/confirmAuth");

// handle image upload for user
router
  .route("/image-upload-user")
  .post(confirmAuth, upload.single("file"), imageUploadUser);

// handle image upload for post
router
  .route("/image-upload-post")
  .post(confirmAuth, upload.single("file"), imageUploadPost);

module.exports = router;
