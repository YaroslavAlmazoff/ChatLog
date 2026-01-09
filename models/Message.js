const mongoose = require("mongoose");

const Message = new mongoose.Schema({
  message: { type: String, default: "" },
  name: { type: String, required: true },
  avatarUrl: { type: String, required: true },
  date: { type: String, required: true },
  user: { type: mongoose.Types.ObjectId, required: true },
  to: { type: mongoose.Types.ObjectId },
  room: { type: mongoose.Types.ObjectId, required: true },
  isNotReaded: { type: Boolean, required: true, default: true },
  isFile: { type: Boolean, required: true, default: false },
  id: { type: Number, required: true, default: 0 },
  images: [{ type: String, default: [] }],
  videos: [{ type: String, default: [] }],
  audios: [{ type: String, default: [] }],
  screenshotUrl: { type: String, default: "" },
  readedThisMessage: [{ type: String, default: [] }],
  fileLink: { type: String, default: "" },
  hms: { type: String, required: true },
});

module.exports = mongoose.model("Message", Message);
