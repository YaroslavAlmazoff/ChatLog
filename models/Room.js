const mongoose = require("mongoose");

const Room = new mongoose.Schema({
  user1: { type: mongoose.Types.ObjectId, required: true },
  user2: { type: mongoose.Types.ObjectId, required: true },
  bg: { type: String },
  lastMessage: { type: String, default: "" },
  lastMessageId: { type: mongoose.Types.ObjectId, required: true },
});

module.exports = mongoose.model("Room", Room);
