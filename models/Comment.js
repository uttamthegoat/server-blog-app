const mongoose = require("mongoose");

const CommentSchema = mongoose.Schema(
  {
    comments: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", CommentSchema);
