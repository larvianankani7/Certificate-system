const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema({
  certificateId: { type: String, required: true, unique: true },
  studentName: { type: String, required: true },
  email: { type: String },
  domain: { type: String },
  startDate: { type: String },
  endDate: { type: String },
  status: { type: String, default: "Pending" } // Pending / Valid / Invalid
});

module.exports = mongoose.model("Certificate", certificateSchema);
