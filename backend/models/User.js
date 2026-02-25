const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  // Auth
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },

  // Profile
  avatar: { type: String },
  contact: { type: String },
  about: { type: String },

  // Professional
  company: { type: String },
  experience: { type: String },
  projects: { type: String },
  skills: { type: String },
  degrees: { type: String } // ← changed to string for now

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
