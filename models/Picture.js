const mongoose = require("mongoose");

const Picture = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  technic: { type: String, required: true },
  size: { type: Number, requred: true },
  price: { type: Number, required: true },
  imageUrl: { type: String, required: true },
});

module.exports = mongoose.model("Picture", Picture);
