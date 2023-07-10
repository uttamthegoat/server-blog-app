const express = require("express");
const router = express.Router();
const confirmAuth = require("../middleware/confirmAuth");
const { searchPosts } = require("../controllers/search");

// search for a specific tag
router.route("/:id").get(confirmAuth, searchPosts);

module.exports = router;
