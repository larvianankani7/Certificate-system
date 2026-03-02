const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

/* ------------------ Middleware ------------------ */
app.use(
  cors({
    origin: 
    [ "http://localhost:3000",
      "http://localhost:5000",
      "https://certificate-system-xi.vercel.app",
    ],
    
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ------------------ Routes ------------------ */
app.use("/api/auth", require("./routes/auth"));
app.use("/api/upload", require("./routes/uploadRoutes"));
app.use("/api/certificates", require("./routes/certificateRoutes"));
app.use("/api/admin", require("./routes/adminProfileRoutes")); // ✅ ADD THIS HERE
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});
/* ------------------ MongoDB Connection ------------------ */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err.message));

/* ------------------ Server ------------------ */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
