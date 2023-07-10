const mongoose = require("mongoose");

const TagSchema = mongoose.Schema({
  tags: {
    type: Array,
    default: [],
  },
});

module.exports = mongoose.model("Tag", TagSchema);
