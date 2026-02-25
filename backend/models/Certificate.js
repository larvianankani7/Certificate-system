const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema({
  certificateId: {
    type: String,
    unique: true
  },

  studentName: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: false,
    lowercase: true,
    trim: true
  },

  course: {
    type: String,
    required: true
  },

  uploadId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Upload",
    required: true
  },

  generatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  pdfPath: {
    type: String
  },

  generatedAt: {
    type: Date,
    default: Date.now
  }
  
});

/* Prevent duplicate certificate generation */
certificateSchema.index(
  { studentName: 1, course: 1, uploadId: 1, generatedBy: 1 },
  { unique: true }
);

/* Faster lookups for students */
certificateSchema.index({ email: 1 });
certificateSchema.index({ studentName: 1 });

module.exports = mongoose.model("Certificate", certificateSchema);
