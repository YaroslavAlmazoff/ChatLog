const mongoose = require("mongoose");

const User = new mongoose.Schema({
  name: { type: String, required: true },
  surname: { type: String, required: true },
  age: { type: String, default: "" },
  email: { type: String, required: true },
  country: { type: String, default: "" },
  city: { type: String, default: "" },
  password: { type: String, required: true },
  avatarUrl: { type: String, default: "user.png" },
  bannerUrl: { type: String, default: "banner.jpg" },
  aboutMe: { type: String, default: "" },
  friends: [{ type: mongoose.Types.ObjectId, default: [] }],
  articles: [{ type: mongoose.Types.ObjectId, default: [] }],
  fotos: [{ type: mongoose.Types.ObjectId, default: [] }],
  subscribes: [{ type: mongoose.Types.ObjectId, default: [] }],
  publicNews: [{ type: mongoose.Types.ObjectId, default: [] }],
  friendsNews: [{ type: mongoose.Types.ObjectId, default: [] }],
  videohostCategories: [{ type: String, default: [] }],
  lastVisit: { type: String, default: "" },
  basket: [{ type: mongoose.Types.ObjectId, required: true }],
  refreshToken: { type: mongoose.Types.ObjectId },
  isActivated: { type: Boolean, default: false },
  returnLink: { type: String, default: "" },
  link: { type: String, default: "" },
  onCourse: { type: Boolean, default: false },
  paid: { type: Boolean, default: false },
});

module.exports = mongoose.model("User", User);
