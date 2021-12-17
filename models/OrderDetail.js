const mongoose = require("mongoose");

const OrderDetailSchema = mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId, ref: 'Product',
    required: true,
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId, ref: 'Order',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("OrderDetail", OrderDetailSchema);
