const express = require("express");
const confirmAuth = require("../middleware/confirmAuth");
const { getAllTag, addNewTag } = require("../controllers/tags");
const router = express.Router();

// add a tag
router.route("/add-tag").post(confirmAuth, addNewTag);

// get all tags
router.route("/get-all-tags/:id").get(confirmAuth, getAllTag);

module.exports = router;
