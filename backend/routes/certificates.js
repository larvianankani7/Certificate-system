const express = require("express");
const router = express.Router();
const Certificate = require("../models/Certificate");
const auth = require("../middleware/authMiddleware");
const multer = require("multer");
const XLSX = require("xlsx");

const upload = multer({ dest: "uploads/" });

router.post("/upload", auth, upload.single("file"), async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ msg: "Forbidden" });
  }

  try {
    const workbook = XLSX.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const savedCertificates = [];

    for (let row of data) {
      const cert = await Certificate.findOneAndUpdate(
        { certificateId: row.certificateId },
        {
          ...row,
          uploadedAt: new Date(), // helps sorting later
        },
        { upsert: true, new: true }
      );

      savedCertificates.push(cert);
    }

    res.json({
      msg: "Certificates uploaded successfully",
      uploadedCount: savedCertificates.length,
      certificates: savedCertificates, 
      redirectTo: "/generate" 
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const certs = await Certificate.find().sort({ uploadedAt: -1 });
    res.json(certs);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.get("/verify/:id", async (req, res) => {
  const cert = await Certificate.findOne({
    certificateId: req.params.id,
  });

  if (!cert) return res.json({ status: "Invalid" });
  res.json(cert);
});

module.exports = router;
