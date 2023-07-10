const express = require("express");
const confirmAuth = require("../middleware/confirmAuth");
const { addTag, getAllTag } = require("../controllers/tags");
const router = express.Router();

// add a tag
router.route("/add-tag").post(confirmAuth, addTag);

// get all tags
router.route("/get-all-tags").get(confirmAuth, getAllTag);

module.exports = router;
