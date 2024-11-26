const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  id: {
    type: String,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  accessToken: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("User", userSchema);
