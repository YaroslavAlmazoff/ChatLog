const mongoose = require("mongoose");

const GameComment = new mongoose.Schema({
  comment: { type: String, required: true },
  date: { type: String, required: true },
  game: { type: String, required: true },
  user: { type: mongoose.Types.ObjectId, required: true },
  avatarUrl: { type: String },
  userName: { type: String, required: true },
  likes: { type: Number, default: 0 },
});

module.exports = mongoose.model("GameComment", GameComment);
