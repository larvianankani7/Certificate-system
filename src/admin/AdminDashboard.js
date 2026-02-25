import React from "react";
import { Link, Route, Routes } from "react-router-dom";
import GenerateCertificate from "../pages/GenerateCertificate";
import UploadExcel from "../pages/UploadExcel";
import Certificates from "./Certificates";
import Downloads from "./Downloads";
import AdminProfile from "./AdminProfile";
import AdminSettings from "./AdminSettings";

export default function AdminDashboard() {
  return (
    <div className="d-flex" style={{ minHeight: "100vh", background: "#071e26" }}>

      {/* Sidebar */}
      <div
        className="d-flex flex-column justify-content-between p-4"
        style={{ width: "240px", background: "#0b2f36" }}
      >
        {/* Top Section */}
        <div>
          <h4 className="text-info mb-4">🛠️ CertifyX Admin</h4>

          <ul className="nav flex-column">
            <li className="nav-item">
              <Link className="nav-link text-light" to="UploadExcel">
                📂 Uploads
              </Link>
            </li>

            <li className="nav-item">
              <Link to="GenerateCertificate" className="nav-link text-light">
                📝 Generate Certificate
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link text-light" to="certificates">
                🎓 Certificates
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link text-light" to="downloads">
                ⬇️ Downloads
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link text-light" to="profile">
                👤 Profile
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link text-light" to="settings">
                ⚙️ Settings
              </Link>
            </li>
          </ul>
        </div>

        {/* Sidebar Footer */}
        <div
          className="text-center pt-3"
          style={{
            borderTop: "1px solid #1c4a54",
            color: "#9fd6e3",
            fontSize: "13px"
          }}
        >
          © 2026 CertifyX <br />
          Secure System 🔐
        </div>
      </div>

      {/* Main content */}
      <div className="flex-grow-1 p-4 text-light">
        <Routes>
          <Route path="/" element={<UploadExcel />} />
          <Route path="UploadExcel" element={<UploadExcel />} />
          <Route path="GenerateCertificate" element={<GenerateCertificate />} />
          <Route path="certificates" element={<Certificates />} />
          <Route path="downloads" element={<Downloads />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="settings" element={<AdminSettings />} />
        </Routes>
      </div>
    </div>
  );
}
