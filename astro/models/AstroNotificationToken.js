const mongoose = require("mongoose");

const AstroNotificationToken = new mongoose.Schema({
  token: { type: String, required: true, unique: true },
  userId: { type: mongoose.Types.ObjectId },
});

module.exports = mongoose.model("AEPNotificationToken", AstroNotificationToken);
