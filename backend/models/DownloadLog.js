const mongoose = require("mongoose");

const downloadLogSchema = new mongoose.Schema({
  certificateId: { type: String, required: true },
  pdfFileName: { type: String, required: true },
  course: { type: String, required: true },
  studentName: { type: String }, // ADD THIS FIELD
  userEmail: { type: String, required: true, lowercase: true, trim: true },
  downloadedAt: { type: Date, default: Date.now }
});

// Faster queries
downloadLogSchema.index({ userEmail: 1 });
downloadLogSchema.index({ certificateId: 1 });

module.exports = mongoose.model("DownloadLog", downloadLogSchema);