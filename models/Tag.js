const mongoose = require("mongoose");

const TagSchema = mongoose.Schema({
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
  tags: {
    type: Array,
    default: [],
  },
});

module.exports = mongoose.model("Tag", TagSchema);
