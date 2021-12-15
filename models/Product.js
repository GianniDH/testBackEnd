const mongoose = require("mongoose");

const ProductSchema = mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId, ref: 'Category',
    required: true,
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
