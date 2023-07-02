const Post = require("../models/Post");
const CustomError = require("../errors/CustomError");

// GET : get all posts
const getAllPosts = async (req, res, next) => {
  try {
    const all_Posts = await Post.find();
    res.status(200).json({ success: true, posts: all_Posts });
  } catch (error) {
    next(error);
  }
};

// GET : get a specific post
const getPost = async (req, res, next) => {
  try {
    const get_Post = await Post.findById(req.params.id);
    res.status(200).json({ success: true, get_Post: get_Post });
  } catch (error) {
    next(error);
  }
};

// POST : create a post
const createPost = async (req, res, next) => {
  try {
    const new_Post = await Post.create({
      user_posts: req.user.id,
      title: req.body.title,
      description: req.body.description,
      tag: req.body.tag,
    });
    res.status(200).json({ success: true, new_Post: new_Post });
  } catch (error) {
    next(error);
  }
};

// PUT : edit a post
const editPost = async (req, res, next) => {
  try {
    const { user_posts } = await Post.findById(req.params.id);
    if (user_posts !== req.user.id) {
      throw new CustomError(
        401,
        false,
        "You are not authorised to edit this post"
      );
    }
    const new_Post = {
      title: req.body.title,
      description: req.body.description,
      tag: req.body.tag,
    };
    const updated_Post = await Post.findByIdAndUpdate(
      req.params.id,
      { $set: new_Post },
      { new: true }
    );
    res.status(200).json({ success: true, post: updated_Post });
  } catch (error) {
    next(error);
  }
};

// DELETE : delete a post
const deletePost = async (req, res, next) => {
  try {
    const { user_posts } = await Post.findById(req.params.id);
    if (user_posts !== req.user.id) {
      throw new CustomError(
        401,
        false,
        "You are not authorised to delete this post"
      );
    }
    const deleted_Post = await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, post: deleted_Post });
  } catch (error) {
    next(error);
  }
};

// GET : get user's posts
const myPosts = async (req, res, next) => {
  try {
    const my_Posts = await Post.find({ user_posts: req.user.id });
    res.status(200).json({ success: true, post: my_Posts });
  } catch (error) {
    next(error);
  }
};

// add a comment  //send the id of the post in req.params
const createComments = async (req, res, next) => {
  try {
    const { post_comments } = await Post.findById(req.params.id);
    const commented_Post = await Post.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { post_comments: post_comments.concat(req.body.comment) } },
      { new: true }
    );
    res
      .status(200)
      .json({ success: true, message: "comment added successfully" });
  } catch (error) {
    next(error);
  }
};

// get all comments
const getAllComments = async (req, res, next) => {
  try {
    const { post_comments } = await Post.findById(req.params.id);
    res.status(200).json({ success: true, all_Comments: post_comments });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllPosts,
  getPost,
  createPost,
  editPost,
  deletePost,
  myPosts,
  createComments,
  getAllComments,
};
