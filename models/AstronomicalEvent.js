const mongoose = require("mongoose");

const AstronomicalEvent = new mongoose.Schema({
  text: { type: String, required: true },
  year: { type: Number, required: true },
  month: { type: String, required: true },
  day: { type: Number, required: true },
  time: { type: String, default: "" },
  image: { type: String },
  information: { type: String },
  interesting: { type: Boolean, default: false },
  visibility: { type: String, default: "" },
  upcoming: { type: Boolean, default: true },
  date: { type: String, required: true },
  notifiedDayBefore: { type: Boolean, default: false },
  notifiedHourBefore: { type: Boolean, default: false },
  type: { type: String, default: "" },
});

module.exports = mongoose.model("AstronomicalEvent", AstronomicalEvent);
