const mongoose = require("mongoose");

const AstroSponsor = new mongoose.Schema({
  name: { type: String, required: true },
  userId: { type: mongoose.Types.ObjectId },
});

module.exports = mongoose.model("AstroSponsor", AstroSponsor);
