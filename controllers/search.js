const asyncErrorHandler = require("../middleware/asyncErrorHandler");
const Post = require("../models/Post");

// search for a post based on title or tag
// add queries to search for the word
exports.searchPosts = asyncErrorHandler(async (req, res) => {
  const searchParam = req.params.id;
  const titles = await Post.find({ title: searchParam });
  const tags = await Post.find({ tag: searchParam });
  searchResult = titles.concat(tags);
  res.status(200).json({ success: true, results: searchResult });
});
