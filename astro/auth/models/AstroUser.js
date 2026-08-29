const mongoose = require("mongoose");

const AstroUser = new mongoose.Schema({
  username: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  verificationCode: { type: String },
  isVerified: { type: Boolean, default: false },
  refreshToken: { type: String },
  favorites: [{ type: mongoose.Types.ObjectId }],
  notificationSettings: [{ type: String }],
  location: { type: Number },
});

module.exports = mongoose.model("AstroUser", AstroUser);
