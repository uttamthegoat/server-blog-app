const express = require("express");
const router = express.Router();
const confirmAuth = require("../middleware/confirmAuth");
const { createComments, getAllComments } = require("../controllers/comments");

// create a comment
router.route("/add-comment/:id").put(confirmAuth, createComments);

// get all comments
router.route("/get-all-comments/:id").get(confirmAuth, getAllComments);

module.exports = router;
