const mongoose = require("mongoose");

const AstroNotificationToken = new mongoose.Schema({
  token: { type: String, required: true, unique: true },
});

module.exports = mongoose.model("AEPNotificationToken", AstroNotificationToken);
