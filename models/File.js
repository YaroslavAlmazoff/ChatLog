const mongoose = require("mongoose");

const File = new mongoose.Schema({
  name: { type: String, required: true },
  path: { type: String, default: "" },
  ext: { type: String, default: "" },
  type: { type: String, required: true },
  size: { type: Number, required: true },
  owner: { type: mongoose.Types.ObjectId, required: true },
  public: { type: Boolean, required: true },
  folder: { type: String, default: "" },
  parentId: { type: String, default: "" },
  previewUrl: { type: String, default: "" },
});

module.exports = mongoose.model("File", File);
