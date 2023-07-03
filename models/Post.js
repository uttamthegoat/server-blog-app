const mongoose = require("mongoose");

const PostSchema = mongoose.Schema(
  {
    user_posts: {
      type: String, // id of the user
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    tag: {
      type: String,
      required: true,
    },
    post_comments: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
