const mongoose = require("mongoose");

const ChatRoom = new mongoose.Schema({
  creator: { type: mongoose.Types.ObjectId },
  title: { type: String, default: "Новая беседа" },
  avatarUrl: { type: String, default: "" },
  bg: { type: String, default: "" },
  members: [{ type: mongoose.Types.ObjectId, required: true, default: [] }],
  lastMessage: { type: String, default: "" },
});

module.exports = mongoose.model("ChatRoom", ChatRoom);
