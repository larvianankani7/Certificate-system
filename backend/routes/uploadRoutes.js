const express = require("express");
const multer = require("multer");
const xlsx = require("xlsx");
const path = require("path");
const Upload = require("../models/Upload");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

/* File storage */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

/* ============================= */
/* Upload Excel (ADMIN ONLY)     */
/* ============================= */
router.post("/excel", auth, upload.single("file"), async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Forbidden" });
    }

    const existing = await Upload.findOne({
      fileName: req.file.originalname,
      uploadedBy: req.user.id
    });

    if (existing) {
      return res.status(400).json({
        error: "File already uploaded. Duplicate uploads not allowed."
      });
    }

    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = xlsx.utils.sheet_to_json(sheet);

    if (!rows || rows.length === 0) {
      return res.status(400).json({ error: "Excel file is empty or invalid" });
    }

    const students = rows.map((row) => {
      const keyMap = {};
      Object.keys(row).forEach((k) => {
        const normalizedKey = k.trim().toLowerCase().replace(/[_\s]/g, "");
        keyMap[normalizedKey] = row[k];
      });

      const getValue = (names) => {
        for (let n of names) {
          const normalizedName = n.toLowerCase().replace(/[_\s]/g, "");
          if (keyMap[normalizedName] !== undefined) return keyMap[normalizedName];
        }
        return "";
      };

      return {
        name: getValue(["Name", "Full Name", "Student Name", "StudentName", "Student_Name","name of students"]),
        email: getValue(["Email", "E-mail", "Email Address", "EmailAddress"]),
        course: getValue(["Course", "Course Name", "CourseName"]),
        score: getValue(["Score", "Marks"]),
        certificateId: null
      };
    });

    const newUpload = new Upload({
      fileName: req.file.originalname,
      students,
      uploadedBy: req.user.id,
      filePath: req.file.path
    });

    await newUpload.save();

    res.status(201).json({
      message: "Excel uploaded successfully",
      uploadId: newUpload._id,
      totalStudents: students.length
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Excel upload failed" });
  }
});

/* ============================= */
/* GET uploads of logged-in admin */
/* ============================= */
router.get("/", auth, async (req, res) => {
  try {
    const uploads = await Upload.find({
      uploadedBy: req.user.id
    }).sort({ uploadedAt: -1 });

    res.json(uploads);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch uploads" });
  }
});

/* ============================= */
/* DOWNLOAD ORIGINAL EXCEL       */
/* ============================= */
router.get("/download/:id", auth, async (req, res) => {
  try {
    const fs = require("fs");

    const upload = await Upload.findOne({
      _id: req.params.id,
      uploadedBy: req.user.id
    });

    if (!upload) {
      return res.status(404).json({ error: "Upload not found" });
    }

    let absolutePath;

    // ✅ If new upload (filePath stored)
    if (upload.filePath) {
      absolutePath = path.resolve(upload.filePath);
    } 
    else {
      // 🔎 Handle old uploads (search by filename)
      const files = fs.readdirSync("uploads");

      const matchedFile = files.find(file =>
        file.endsWith(upload.fileName)
      );

      if (!matchedFile) {
        return res.status(404).json({ error: "File not found on server" });
      }

      absolutePath = path.resolve("uploads", matchedFile);
    }

    if (!fs.existsSync(absolutePath)) {
      return res.status(404).json({ error: "File does not exist" });
    }

    return res.download(absolutePath);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Download failed" });
  }
});


/* ============================= */
/* GET students of one upload    */
/* ============================= */
router.get("/:id/students", auth, async (req, res) => {
  try {
    const upload = await Upload.findOne({
      _id: req.params.id,
      uploadedBy: req.user.id
    });

    if (!upload) {
      return res.status(404).json({ error: "Upload not found" });
    }

    res.json(upload.students);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch students" });
  }
});

module.exports = router;
