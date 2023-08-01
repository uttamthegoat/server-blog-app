const express = require("express");
const router = express.Router();
const confirmAuth = require("../middleware/confirmAuth");
const {
  createSocialMedia,
  getSocialMedia,
  getWriterSocialMedia,
} = require("../controllers/socialMedia");

// Add social media information
router.route("/add-social-media").put(confirmAuth, createSocialMedia);

// Get all social media information
router.route("/get-social-media").get(confirmAuth, getSocialMedia);

// Get all social media information
router.route("/get-writer-socialmedia/:id").get(confirmAuth, getWriterSocialMedia);

module.exports = router;
