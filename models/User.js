const mongoose = require("mongoose");

var validateEmail = function(email) {
  var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email)
};

const UserSchema = mongoose.Schema({
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
    validate: [validateEmail, 'Please fill a valid email address'],
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
  },
  password: {
    type: String,
    required: true,
  },
  phoneNr: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /\d{10}/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    },
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
