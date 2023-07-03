const Post = require("../models/Post");
const Comment = require("../models/Comment");
const CustomError = require("../errors/CustomError");

// add a comment  //send the id of the post in req.params
const createComments = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      throw new CustomError(404, false, "Post not found");
    }
    const old_Comments = await Comment.findById(post.post_comments);
    if (!old_Comments) {
      throw new CustomError(404, false, "Comment not found");
    }
    old_Comments.comments = old_Comments.comments.concat(req.body.comment);
    await old_Comments.save();
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
    const post = await Post.findById(req.params.id);
    if (!post) {
      throw new CustomError(404, false, "Post not found");
    }
    const all_Comments = await Comment.findById(post.post_comments);
    if (!all_Comments)
      throw new CustomError(400, false, "Comments are not found");
    res
      .status(200)
      .json({ success: true, all_Comments: all_Comments.comments });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createComments,
  getAllComments,
};
