const mongoose = require("mongoose");

const faceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  roll: { type: String, required: true },
  faceData: { type: [[Number]], required: true }, // Array of 2D points for landmarks
  dateTime: { type: String, required: true },  // String for datetime
  profileImage: { type: String, required: true },  // String for image URL
  status: { type: Object, default: { present: false, date: Date.now() } },  // Default status
});

const Face = mongoose.model("Face", faceSchema);
module.exports = Face;
