const express = require("express");
const router = express.Router();
const confirmAuth = require("../middleware/confirmAuth");
const { searchPosts } = require("../controllers/search");

// search for a specific tag
// https://localhost:5002/api/v1/blog-app/search?query=whatever&page=1&pageSize=1
router.route("/").get(confirmAuth, searchPosts);

module.exports = router;
