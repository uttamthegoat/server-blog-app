const CustomError = require("../errors/CustomError");
const asyncErrorHandler = require("../middleware/asyncErrorHandler");
const Post = require("../models/Post");
const Tag = require("../models/Tag");

// search for a post based on title or tag
// add queries to search for the word
exports.searchPosts = asyncErrorHandler(async (req, res) => {
  const searchParam = req.params.query.toLowerCase().trim();
  const tags = await Tag.find({});
  const searches = tags.filter((obj) => {
    return obj.tags.includes(searchParam);
  });
  const results = await Post.find({
    _id: { $in: searches.map((tag) => tag.post) },
  }).select("image title description");
  if(!results) throw new CustomError(400,false,"Search Results not found")
  const totalResults = results.length
  res.status(200).json({ success: true, totalResults, results });
});
