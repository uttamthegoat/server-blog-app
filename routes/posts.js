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
  checkUser,
} = require("../controllers/posts");

// getAllPosts  : https://localhost:5002/api/v1/blog-app/posts?page=1&pageSize=1
router.route("/").get(confirmAuth, getAllPosts);

// get a specific post
router.route("/getPost/:id").get(confirmAuth, getPost);

// create a post
router.route("/createPost").post(confirmAuth, createPost);

// check whether the user is the one trying to change the post
router.route("/check-user/:id").get(confirmAuth, checkUser);

// edit a specific post
router.route("/editPost/:id").put(confirmAuth, editPost);

// delete a specific post
router.route("/deletePost/:id").delete(confirmAuth, deletePost);

// get user's post
router.route("/my-posts").get(confirmAuth, myPosts);

module.exports = router;
