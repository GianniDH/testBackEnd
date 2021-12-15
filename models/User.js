const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    required: true,
  },
  isSuperAdmin: {
    type: Boolean,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  phoneNr: {
    type: String,
    required: true,
  },
  address1: {
    type: String,
    required: true,
  },
  address2: {
    type: String,
  },
  postalCode: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("User", UserSchema);
