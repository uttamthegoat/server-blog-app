const CustomError = require("../errors/CustomError");
const asyncErrorHandler = require("../middleware/asyncErrorHandler");
const Post = require("../models/Post");
const Tag = require("../models/Tag");

exports.addTag = asyncErrorHandler(async (req, res) => {
  const post = await Post.findById(req.body.id);
  if (!post) throw new CustomError(404, false, "Post was not found");
  const tag = await Tag.findById(post.post_tags);
  if (!tag) throw new CustomError(404, false, "Tags were not found");
  tag.tags = tag.tags.concat(req.body.tag);
  await tag.save();
  res.status(200).json({ success: true, message: "Tag added successfully" });
});

exports.getAllTag = asyncErrorHandler(async (req, res) => {
  const post = await Post.findById(req.body.id);
  if (!post) throw new CustomError(404, false, "Post was not found");
  const tag = await Tag.findById(post.post_tags);
  if (!tag) throw new CustomError(404, false, "Tags were not found");
  res.status(200).json({
    success: true,
    results: tag.tags,
    message: "Tags fetched successfully",
  });
});
