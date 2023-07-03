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
  createComments,
  getAllComments,
} = require("../controllers/posts");

// getAllPosts
router.get("/posts", confirmAuth, getAllPosts);

// get a specific post
router.get("/posts/getPost/:id", confirmAuth, getPost);

// create a post
router.post("/posts/createPost", confirmAuth, createPost);

// edit a specific post
router.put("/posts/editPost/:id", confirmAuth, editPost);

// delete a specific post
router.delete("/posts/deletePost/:id", confirmAuth, deletePost);

// get user's post
router.get("/posts/my-posts", confirmAuth, myPosts);

// create a comment
router.put("/posts/add-comment/:id", confirmAuth, createComments);

// get all comments
router.get("/posts/get-all-comments/:id", confirmAuth, getAllComments);

module.exports = router;
