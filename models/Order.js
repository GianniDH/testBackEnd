const mongoose = require("mongoose");

const OrderSchema = mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId, ref: 'User',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("Order", OrderSchema);
