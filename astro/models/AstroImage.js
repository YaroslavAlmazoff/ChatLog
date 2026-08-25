const mongoose = require("mongoose");

const AstroImage = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  text: { type: String, default: "" },
  event: { type: mongoose.Types.ObjectId, required: true },
});

module.exports = mongoose.model("AstronomicalImage", AstroImage);
