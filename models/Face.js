const mongoose = require("mongoose");

const faceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  roll: { type: String, required: true },
  faceEmbedding: { type: [Number], required: true }, // 128-dimensional embedding
  dateTime: { type: String, required: true },
  status: { type: Object, default: { present: false, date: Date.now() } },
});

const Face = mongoose.model("Face", faceSchema);
module.exports = Face;
