const express = require("express");
const router = express.Router();
const confirmAuth = require("../middleware/confirmAuth");
const {
  createSocialMedia,
  getSocialMedia,
} = require("../controllers/socialMedia");

// Add social media information
router.route("/add-social-media").post(confirmAuth, createSocialMedia);

// Get all social media information
router.route("/get-social-media").get(confirmAuth, getSocialMedia);

module.exports = router;
