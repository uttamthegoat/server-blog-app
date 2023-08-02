const CustomError = require("../errors/CustomError");
const asyncErrorHandler = require("../middleware/asyncErrorHandler");
const Post = require("../models/Post");
const Tag = require("../models/Tag");


// get all tags
exports.getAllTag = asyncErrorHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) throw new CustomError(404, false, "Post was not found");
  const tag = await Tag.findOne({ post: post.id });
  if (!tag) throw new CustomError(404, false, "Tags were not found");
  res.status(200).json({
    success: true,
    results: tag.tags,
    message: "Tags fetched successfully",
  });
});

// add a tag
exports.addNewTag = asyncErrorHandler(async (req, res) => {
  const { id, tag } = req.body;
  const post = await Post.findById(id);
  if (!post) throw new CustomError(404, false, "Post was not found");
  const old_tag = await Tag.findOne({ post: post.id });
  if (!old_tag) throw new CustomError(404, false, "Tags were not found");
  const new_tags = tag.map((tag) => tag.toLowerCase().trim());
  console.log(new_tags);
  old_tag.tags = old_tag.tags.concat(new_tags);
  await old_tag.save();
  res.status(200).json({ success: true, message: "Tag added successfully" });
});
