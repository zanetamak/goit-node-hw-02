const { mongoose, Schema } = require('mongoose');
const bCrypt = require("bcryptjs");

const users = new Schema({
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
  },
  subscription: {
    type: String,
    enum: ["starter", "pro", "business"],
    default: "starter"
  },
  token: {
    type: String,
    default: null,
  },
   avatarURL: {
    type: String,
    default: null,
  },
  verify: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
    required: [true, 'Verify token is required'],
  },
});

users.methods.setPassword = function (password) {
  this.password = bCrypt.hashSync(password, bCrypt.genSaltSync(6));
};

users.methods.validPassword = function (password) {
  return bCrypt.compareSync(password, this.password);
};

const User = mongoose.model("user", users);

module.exports = { User };