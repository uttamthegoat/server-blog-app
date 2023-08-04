const Tag = require("../models/Tag");
const User = require("../models/User");
const Post = require("../models/Post");
const SocialMedia = require("../models/SocialMedia");
const Comment = require("../models/Comment");
const CustomError = require("../errors/CustomError");
const asyncErrorHandler = require("../middleware/asyncErrorHandler");

// GET : get all posts
exports.getAllPosts = asyncErrorHandler(async (req, res) => {
  const all_Posts = await Post.find({});
  if (!all_Posts) throw new CustomError(400, false, "Posts not to be found");
  const { page, pageSize } = req.query;

  const startIndex = (page - 1) * pageSize;
  const lastIndex = page * pageSize;

  const results = all_Posts.slice(startIndex, lastIndex);
  const totalResults = all_Posts.length;
  res.status(200).json({ success: true, totalResults, results });
});

// GET : get a specific post
exports.getPost = asyncErrorHandler(async (req, res) => {
  const get_Post = await Post.findById(req.params.id);
  if (!get_Post) throw new CustomError(400, false, "Post not to be found");
  const userId = get_Post.user;
  const post_tags = await Tag.findOne({ post: req.params.id });
  if (!post_tags) throw new CustomError(400, false, "Tags not to be found");
  const { tags } = post_tags;
  const author = await User.findById(userId).select("name email image");
  if (!author) throw new CustomError(400, false, "Author not found");
  const socialMedia = await SocialMedia.findOne({ user: author._id }).select(
    "instagram facebook twitter linkedin"
  );
  if (!socialMedia)
    throw new CustomError(400, false, "Author's social media not found");
  res
    .status(200)
    .json({ success: true, tags, author, socialMedia, post: get_Post });
});

// POST : create a post
exports.createPost = asyncErrorHandler(async (req, res) => {
  const new_Post = await Post.create({
    user: req.user.id,
    title: req.body.title,
    description: req.body.description,
  });
  if (!new_Post) throw new CustomError(400, false, "Post not created");
  const comment = await Comment.create({
    post: new_Post._id,
  });
  if (!comment) throw new CustomError(400, false, "Comment not created");
  const tag = await Tag.create({
    post: new_Post._id,
  });
  if (!tag) throw new CustomError(400, false, "Tag not created");
  res.status(200).json({
    success: true,
    result: new_Post,
    message: "Blog has been successfully created",
  });
});

// GET : check whether the user is the one trying to change the post
exports.checkUser = asyncErrorHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (post.user.valueOf() !== req.user.id)
    throw new CustomError(
      401,
      false,
      "You are not authorised to edit this post"
    );
  res
    .status(200)
    .json({ success: true, message: "You are allowed to edit the post" });
});

// PUT : edit a post
exports.editPost = asyncErrorHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post)
    throw new CustomError(400, false, "The post to be edited was not found");
  const new_Post = {
    title: req.body.title,
    description: req.body.description,
  };
  const updated_Post = await Post.findByIdAndUpdate(
    req.params.id,
    { $set: new_Post },
    { new: true }
  ).select("_id title description");

  if (!updated_Post) throw new CustomError(400, false, "Post was not Updated");
  res.status(200).json({
    success: true,
    message: "Post was successfully updated",
    post: updated_Post,
  });
});

// DELETE : delete a post
exports.deletePost = asyncErrorHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post)
    throw new CustomError(400, false, "The post to be deleted was not found");
  if (post.user.valueOf() !== req.user.id)
    throw new CustomError(
      401,
      false,
      "You are not authorised to delete this post"
    );
  const deleted_Comment = await Comment.findOneAndDelete({ post: post.id });
  if (!deleted_Comment)
    throw new CustomError(400, false, "Comment to be deleted was not found");
  const deleted_Tag = await Tag.findOneAndDelete({ post: post.id });
  if (!deleted_Tag)
    throw new CustomError(400, false, "Tags to be deleted were not found");
  const deleted_Post = await Post.findByIdAndDelete(req.params.id);
  if (!deleted_Post) throw new CustomError(400, false, "Post was not deleted");
  res
    .status(200)
    .json({ success: true, message: "Post was successfully deleted" });
});

// GET : get user's posts
exports.myPosts = asyncErrorHandler(async (req, res) => {
  const results = await Post.find({ user: req.user.id });
  if (!results) throw new CustomError(400, false, "Your posts were not found");
  const totalResults = results.length;
  res.status(200).json({ success: true, totalResults, results });
});
