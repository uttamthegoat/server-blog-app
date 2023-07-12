const asyncErrorHandler = require("../middleware/asyncErrorHandler");
const Post = require("../models/Post");
const Tag = require("../models/Tag");

// search for a post based on title or tag
// add queries to search for the word
exports.searchPosts = asyncErrorHandler(async (req, res) => {
  const searchParam = req.params.id.toLowerCase();
  const tags = await Tag.find();
  const searches = tags.filter((obj) => {
    return obj.tags.includes(searchParam);
  });
  const searchResults = await Post.find({
    post_tags: { $in: searches.map((tag) => tag._id) },
  });
  res.status(200).json({ success: true, results: searchResults });
});
