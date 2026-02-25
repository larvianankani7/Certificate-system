const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
  name: String,
  email: String,
  course: String,
  score: String,
  certificateId: String
});

const UploadSchema = new mongoose.Schema({
  fileName: {
    type: String,
    required: true
  },

  filePath: {          // ✅ NEW FIELD
    type: String
  },

  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  uploadedAt: {
    type: Date,
    default: Date.now
  },

  students: [StudentSchema]
});

/* Prevent duplicate file upload by same admin */
UploadSchema.index({ fileName: 1, uploadedBy: 1 }, { unique: true });

module.exports = mongoose.model("Upload", UploadSchema);
