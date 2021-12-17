const mongoose = require("mongoose");

const CategorySchema = mongoose.Schema({
  category: {
    type: String,
    required: true,
  },
  headCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: false,
  },
});
module.exports = mongoose.model("Category", CategorySchema);
