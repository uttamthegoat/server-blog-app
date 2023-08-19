const CustomError = require("../errors/CustomError");
const asyncErrorHandler = require("../middleware/asyncErrorHandler");
const Post = require("../models/Post");
const Tag = require("../models/Tag");

// search for a post based on title or tag
// add queries to search for the word
exports.searchPosts = asyncErrorHandler(async (req, res) => {
  const { page, pageSize } = req.query;
  const startIndex = (page - 1) * pageSize;
  const lastIndex = page * pageSize;

  const searchString = req.params.query.toLowerCase().trim();
  const tags = await Tag.find({});
  const searches = tags.filter((obj) => {
    return obj.tags.includes(searchString);
  });
  const regex = new RegExp(searchString, "i");

  let results = await Post.find({
    _id: { $in: searches.map((tag) => tag.post) },
  });
  if (!results) throw new CustomError(400, false, "Search Results not found");
  const foundPosts = await Post.find({
    $or: [{ title: regex }, { description: regex }],
  });
  if (!foundPosts) throw new CustomError(400, false, "No Posts found");
  results = results.concat(foundPosts);
  results = results.slice(startIndex, lastIndex);
  const totalResults = results.length;
  res.status(200).json({ success: true, totalResults, results });
});
