const Post = require("../models/Post");
const Comment = require("../models/Comment");
const CustomError = require("../errors/CustomError");
const asyncErrorHandler = require("../middleware/asyncErrorHandler");

// add a comment  //send the id of the post in req.params
exports.createComments = asyncErrorHandler(async (req, res) => {
  const { comment, user } = req.body;
  const post = await Post.findById(req.params.id);
  if (!post) throw new CustomError(404, false, "Post not found");

  const old_Comments = await Comment.findOne({ post: post.id });
  if (!old_Comments) throw new CustomError(404, false, "Comment not found");
  old_Comments.comments = [{ comment, user }].concat(old_Comments.comments);
  const { comments } = await old_Comments.save();
  if (!comments) throw new CustomError(400, false, "Comment was not added");
  res.status(200).json({
    success: true,
    message: "comment added successfully",
  });
});

// get all comments
exports.getAllComments = asyncErrorHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) throw new CustomError(404, false, "Post not found");

  const all_Comments = await Comment.findOne({ post: post.id });
  if (!all_Comments)
    throw new CustomError(400, false, "Comments are not found");
  res.status(200).json({
    success: true,
    totalComments: all_Comments.comments.length,
    all_Comments: all_Comments.comments,
  });
});
