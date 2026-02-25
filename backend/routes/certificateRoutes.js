const express = require("express");
const router = express.Router();
const Certificate = require("../models/Certificate");
const Upload = require("../models/Upload");
const DownloadLog = require("../models/DownloadLog");
const { v4: uuidv4 } = require("uuid");
const generatePDF = require("../utils/generatePDF");
const fs = require("fs");
const path = require("path");
const auth = require("../middleware/authMiddleware");


/* ============================= */
/* GENERATE CERTIFICATE (ADMIN)  */
/* ============================= */
router.post("/generate", auth, async (req, res) => {
  try {
    console.log("LOG 1 - BACKEND RECEIVED:", req.body);

    const { name, email, course, uploadId } = req.body;

    // We use a plain object first to make sure variables are defined
    const certData = {
      certificateId: uuidv4(),
      studentName: name, // Maps 'name' from Admin to 'studentName' for DB
      email: email,
      course: course,
      uploadId: uploadId,
      generatedBy: req.user.id,
      generatedAt: new Date()
    };

    console.log("LOG 2 - DATA MAPPED:", certData);

    // This is the line that was likely failing:
    const cert = new Certificate(certData);
    
    await cert.save();
    console.log("LOG 3 - SAVED TO DB");

    // PDF Generation
    const pdfPath = await generatePDF(cert);
    cert.pdfPath = pdfPath;
    await cert.save();

    res.status(201).json({
      message: "Certificate generated successfully",
      certificateId: cert._id
    });

  } catch (err) {
    // Check your terminal for THIS error message
    console.error("CRITICAL ERROR IN GENERATE:", err); 
    res.status(500).json({ error: "Certificate generation failed" });
  }
});


/* ============================= */
/* GET CERTIFICATES (ADMIN ONLY) */
/* ============================= */
router.get("/", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Forbidden" });
    }

    const certs = await Certificate.find({
      generatedBy: req.user.id
    }).sort({ generatedAt: -1 });

    res.json(certs);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch certificates" });
  }
});


/* ============================= */
/* STUDENT VIEW GENERATED CERTS  */
/* MATCH BY NAME (CASE INSENSITIVE) */
/* ============================= */
router.get("/student", auth, async (req, res) => {
  try {
    // 1. Check if user is logged in
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // 2. Fetch all certificates to allow frontend to filter by name OR email
    // We sort by newest first
    const certs = await Certificate.find().sort({ generatedAt: -1 }).lean();

    console.log(`Sending ${certs.length} certificates to student frontend`);
    
    // 3. Send the response and RETURN immediately so code stops here
    return res.status(200).json(certs);

  } catch (err) {
    console.error("GET CERTS ERROR:", err);
    // Use return here too so it doesn't try to execute anything else
    return res.status(500).json({ error: "Failed to fetch certificates" });
  }
});


/* ============================= */
/* STUDENT DOWNLOAD (MULTIPLE ALLOWED) */
/* LOG ONLY FIRST DOWNLOAD       */
/* ============================= */
router.get("/student/download/:id", auth, async (req, res) => {
  try {
    // 1. Role Check
    if (!["user", "admin"].includes(req.user.role)) {
      return res.status(403).json({ error: "Forbidden: Invalid Role" });
    }

    const cert = await Certificate.findById(req.params.id);
    if (!cert) {
      return res.status(404).json({ error: "Certificate not found" });
    }

    // --- FLEXIBLE IDENTITY MATCHING ---
    if (req.user.role === "user") {
      const loggedInName = (req.user.name || "").toLowerCase().trim();
      const loggedInEmail = (req.user.email || "").toLowerCase().trim();
      
      const certName = (cert.studentName || "").toLowerCase().trim();
      const certEmail = (cert.email || "").toLowerCase().trim();
      console.log(`DEBUG: User(${loggedInName} | ${loggedInEmail}) vs Cert(${certName} | ${certEmail})`);
      // Check if Name matches OR Email matches
      const nameMatch = loggedInName !== "" && certName === loggedInName;
      const emailMatch = loggedInEmail !== "" && certEmail === loggedInEmail;

      // Special fallback for older records that might have "EMPTY" or missing names
      const isOldRecord = certName === "empty" || certName === "";
      
      if (isOldRecord) {
        // If it's an old record, we trust the email match
        if (!emailMatch) {
          console.log(`403: Old Record Email Mismatch. Expected ${certEmail}, got ${loggedInEmail}`);
          console.log("!!! 403 REJECTED: Neither Name nor Email matched.");
          return res.status(403).json({ error: "Unauthorized: Identity mismatch" });
        }
      } else {
        // For new records, either name or email must work
        if (!nameMatch && !emailMatch) {
          console.log(`403: Identity Mismatch. Name: ${nameMatch}, Email: ${emailMatch}`);
          return res.status(403).json({ error: "Unauthorized access" });
        }
      }
    }

    // 2. Download Logging
    if (req.user.role === "user") {
      const alreadyDownloaded = await DownloadLog.findOne({
        certificateId: cert.certificateId,
        userEmail: req.user.email
      });

      if (!alreadyDownloaded) {
        await DownloadLog.create({
          certificateId: cert.certificateId,
          pdfFileName: cert.pdfPath,
          course: cert.course,
          studentName: cert.studentName || "Legacy Student", 
          userEmail: req.user.email,
          downloadedAt: new Date()
        });
      }
    }

    // 3. File Path Construction
    const filePath = path.join(__dirname, "..", "certificates", `${cert.certificateId}.pdf`);

    // 4. Send File
    if (!fs.existsSync(filePath)) {
      console.log("FILE NOT FOUND AT:", filePath);
      return res.status(404).json({ error: "PDF file not found on server" });
    }

    return res.download(filePath);

  } catch (err) {
    console.error("DOWNLOAD ERROR:", err);
    if (!res.headersSent) {
      return res.status(500).json({ error: "Download failed" });
    }
  }
});

/* ============================= */
/* STUDENT DOWNLOAD HISTORY      */
/* ============================= */
router.get("/student/downloads", auth, async (req, res) => {
  try {
    // 1. Basic role check
    if (!["user", "admin"].includes(req.user.role)) {
      return res.status(403).json({ error: "Forbidden" });
    }

    // 2. Fetch logs
    // If Admin, they see everything. If user, we fetch by their email.
    let query = {};
    if (req.user.role === "user") {
      query = { userEmail: req.user.email.toLowerCase().trim() };
    }

    const downloads = await DownloadLog.find(query).sort({ downloadedAt: -1 }).lean();

    // 3. Send response and RETURN to prevent double-header errors
    console.log(`Sending ${downloads.length} logs to ${req.user.email}`);
    return res.status(200).json(downloads);

  } catch (err) {
    console.error("GET DOWNLOADS ERROR:", err);
    // Ensure only one response is sent in the catch block
    if (!res.headersSent) {
      return res.status(500).json({ error: "Failed to fetch downloads" });
    }
  }
});


/* ============================= */
/* STUDENT TRACK STATUS          */
/* GENERATED / DOWNLOADED        */
/* ============================= */
router.get("/student/track", auth, async (req, res) => {
  try {
    if (req.user.role !== "user") {
      return res.status(403).json({ error: "Forbidden" });
    }

    const certs = await Certificate.find({
      email: req.user.email
    }).sort({ generatedAt: -1 });


    const logs = await DownloadLog.find({
      userEmail: req.user.email
    });

    const downloadedIds = new Set(logs.map(l => l.certificateId));

    const response = certs.map(cert => ({
      _id: cert._id,
      course: cert.course || "N/A",
      certificateId: cert.certificateId || cert._id,
      generatedAt: cert.generatedAt,
      status: downloadedIds.has(cert._id.toString())
        ? "Downloaded"
        : "Certificate Generated"
    }));


    res.json(response);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to track certificates" });
  }
});


/* ============================= */
/* VERIFY CERTIFICATE (PUBLIC)   */
/* ============================= */
router.get("/verify/:certificateId", async (req, res) => {
  try {
    const cert = await Certificate.findOne({
      certificateId: req.params.certificateId
    });

    if (!cert) {
      return res.status(404).json({
        valid: false,
        message: "Certificate not found"
      });
    }

    res.json({
      valid: true,
      certificate: {
        name: cert.studentName,
        email: cert.email,
        course: cert.course,
        certificateId: cert.certificateId,
        issuedOn: cert.generatedAt
      }
    });

  } catch (err) {
    res.status(500).json({ error: "Verification failed" });
  }
});

module.exports = router;
