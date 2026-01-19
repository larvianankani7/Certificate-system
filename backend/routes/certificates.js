const express = require("express");
const router = express.Router();
const Certificate = require("../models/Certificate");
const auth = require("../middleware/authMiddleware");
const multer = require("multer");
const XLSX = require("xlsx");

const upload = multer({ dest: "uploads/" });

// Upload Excel
router.post("/upload", auth, upload.single("file"), async(req,res)=>{
  if(req.user.role !== "admin") return res.status(403).json({msg:"Forbidden"});
  try{
    const workbook = XLSX.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    for(let row of data){
      await Certificate.findOneAndUpdate(
        {certificateId: row.certificateId},
        {...row},
        {upsert:true, new:true}
      );
    }
    res.json({msg:"Certificates uploaded"});
  }catch(err){ res.status(500).json({msg:err.message}); }
});

// List certificates (Admin)
router.get("/", auth, async(req,res)=>{
  const certs = await Certificate.find();
  res.json(certs);
});

// Verify certificate (public)
router.get("/verify/:id", async(req,res)=>{
  const cert = await Certificate.findOne({certificateId:req.params.id});
  if(!cert) return res.json({status:"Invalid"});
  res.json(cert);
});

module.exports = router;
