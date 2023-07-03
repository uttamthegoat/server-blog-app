const Post = require("../models/Post");
const Comment = require("../models/Comment");
const CustomError = require("../errors/CustomError");

// GET : get all posts
const getAllPosts = async (req, res, next) => {
  try {
    const all_Posts = await Post.find();
    if (!all_Posts) throw new CustomError(400, false, "Posts not to be found");
    res.status(200).json({ success: true, posts: all_Posts });
  } catch (error) {
    next(error);
  }
};

// GET : get a specific post
const getPost = async (req, res, next) => {
  try {
    const get_Post = await Post.findById(req.params.id);
    if (!get_Post) throw new CustomError(400, false, "Post not to be found");
    res.status(200).json({ success: true, get_Post: get_Post });
  } catch (error) {
    next(error);
  }
};

// POST : create a post
const createPost = async (req, res, next) => {
  try {
    const comment = await Comment.create({
      comments: [],
    });
    if (!comment) throw new CustomError(400, false, "Comment not created");
    const new_Post = await Post.create({
      user_posts: req.user.id,
      title: req.body.title,
      description: req.body.description,
      tag: req.body.tag,
      post_comments: comment._id,
    });
    if (!new_Post) throw new CustomError(400, false, "Post not created");
    res.status(200).json({ success: true, new_Post: new_Post });
  } catch (error) {
    next(error);
  }
};

// PUT : edit a post
const editPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post)
      throw new CustomError(400, false, "The post to be edited was not found");
    if (post.user_posts !== req.user.id)
      throw new CustomError(
        401,
        false,
        "You are not authorised to edit this post"
      );
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
    if (!updated_Post)
      throw new CustomError(400, false, "Post was not Updated");
    res
      .status(200)
      .json({ success: true, message: "Post was successfully updated" });
  } catch (error) {
    next(error);
  }
};

// DELETE : delete a post
const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post)
      throw new CustomError(400, false, "The post to be deleted was not found");
    if (post.user_posts !== req.user.id)
      throw new CustomError(
        401,
        false,
        "You are not authorised to delete this post"
      );
    const deleted_Comment = await Comment.findByIdAndDelete(post.post_comments);
    if (!deleted_Comment)
      throw new CustomError(400, false, "Comment to be deleted was not found");
    const deleted_Post = await Post.findByIdAndDelete(req.params.id);
    if (!deleted_Post)
      throw new CustomError(400, false, "Post was not deleted");
    res
      .status(200)
      .json({ success: true, message: "Post was successfully deleted" });
  } catch (error) {
    next(error);
  }
};

// GET : get user's posts
const myPosts = async (req, res, next) => {
  try {
    const my_Posts = await Post.find({ user_posts: req.user.id });
    if (!my_Posts)
      throw new CustomError(400, false, "Your posts were not found");
    res.status(200).json({ success: true, post: my_Posts });
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
};
