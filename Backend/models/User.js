const mongoose = require("mongoose");
const FriendListSchema = new mongoose.Schema({
  code: { type: String },
});
const UserSchema = new mongoose.Schema({
  name: { type: String, require: true },
  email: { type: String, require: true },
  password: { type: String, require: true },
  friendList: [FriendListSchema],
  ProfilePictureSrc: { type: String, default: "" },
});
module.exports = mongoose.model("User", UserSchema);
