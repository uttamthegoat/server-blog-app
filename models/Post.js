const mongoose = require("mongoose");

const PostSchema = mongoose.Schema(
  {
    image: {
      // added image field. remember to add link in createPost endpoint
      type: String,
      default:"",
      trim: true,
    },
    user_posts: {
      type: String,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    post_tags: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tag",
    },
    post_comments: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
