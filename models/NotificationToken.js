const mongoose = require("mongoose");

const NotificationToken = new mongoose.Schema({
  token: { type: String, required: true },
  user: { type: String, required: true, unique: true },
});

module.exports = mongoose.model("NotificationToken", NotificationToken);
