const express = require("express");
const router = express.Router();
const confirmAuth = require("../middleware/confirmAuth");
const {
  getAllPosts,
  getPost,
  createPost,
  editPost,
  deletePost,
  myPosts,
} = require("../controllers/posts");

// getAllPosts
router.route("/").get(confirmAuth, getAllPosts);

// get a specific post
router.route("/getPost/:id").get(confirmAuth, getPost);

// create a post
router.route("/createPost").post(confirmAuth, createPost);

// edit a specific post
router.route("/editPost/:id").put(confirmAuth, editPost);

// delete a specific post
router.route("/deletePost/:id").delete(confirmAuth, deletePost);

// get user's post
router.route("/my-posts").get(confirmAuth, myPosts);

module.exports = router;
