const getAllPosts = async (req, res, next) => {
  try {
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllPosts };
