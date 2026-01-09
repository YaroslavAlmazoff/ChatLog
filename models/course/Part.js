const mongoose = require("mongoose");

const Part = new mongoose.Schema({
  title: { type: String, required: true },
  number: { type: Number, require: true, unique: true },
});

module.exports = mongoose.model("Part", Part);
