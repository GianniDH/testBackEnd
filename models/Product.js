const mongoose = require("mongoose");

const ProductSchema = mongoose.Schema({
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
    maxlength: [100, "Description is too long!"],
  },
  isActive: {
    type: Boolean,
    required: true,
  },
  amountInStock: {
    type: Number,
    required: true,
    default: 0,
  },
  size: {
    type: String,
  },
  color: {
    type: String,
  },
  expirationDate: {
    type: Date,
    min: [
      new Date(),
      "Expiration date has to be on a future date! It is currently: " +
        new Date(),
    ],
  },
  amountProduct: {
    type: String,
  },
  imageUrl: {
    type: Array,
    required: true,
  },
});

module.exports = mongoose.model("Product", ProductSchema);
