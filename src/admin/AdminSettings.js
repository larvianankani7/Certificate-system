import React, { useEffect, useState } from "react";
import axios from "../services/api";
import { useNavigate } from "react-router-dom";

export default function AdminSettings() {
  const [profile, setProfile] = useState({});
  const [darkMode, setDarkMode] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();

    // Load saved theme
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") {
      setDarkMode(false);
      applyLightTheme();
    } else {
      setDarkMode(true);
      applyDarkTheme();
    }
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get("/admin/profile");
      setProfile(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  /* ------------------ THEME SYSTEM ------------------ */

  const applyDarkTheme = () => {
    document.body.style.backgroundColor = "#071e26";
    document.body.style.color = "#ffffff";
    localStorage.setItem("theme", "dark");
  };

  const applyLightTheme = () => {
    document.body.style.backgroundColor = "#f4f9fb";
    document.body.style.color = "#000000";
    localStorage.setItem("theme", "light");
  };

  const toggleTheme = () => {
    if (darkMode) {
      applyLightTheme();
      setDarkMode(false);
    } else {
      applyDarkTheme();
      setDarkMode(true);
    }
  };

  /* ------------------ LOGOUT ------------------ */

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="d-flex flex-column" style={{ minHeight: "80vh" }}>
      <div className="flex-grow-1">
        <h3 className="text-info mb-4">⚙️ Settings</h3>

        <div
          className="card p-4 mb-4"
          style={{ backgroundColor: "#0b2f36", border: "1px solid #17c0c9" }}
        >
          <h5 className="text-info">🌗 Theme Settings</h5>
          <div className="form-check form-switch mt-3">
            <input
              className="form-check-input text-light"
              type="checkbox"
              checked={darkMode}
              onChange={toggleTheme}
              style={{ cursor: "pointer" }}
            />
            <label className="form-check-label text-light">
              {darkMode ? "Dark Mode Enabled" : "Light Mode Enabled"}
            </label>
          </div>
        </div>

        {/* Profile Summary */}
        <div
          className="card p-4 mb-4"
          style={{ backgroundColor: "#0b2f36", border: "1px solid #17c0c9" }}
        >
          <h5 className="text-info">👤 Profile Information</h5>
          <p className= "text-light"><strong>Name:</strong> {profile.name || "—"}</p>
          <p className= "text-light"><strong>Email:</strong> {profile.email || "—"}</p>
          <p className= "text-light"><strong>Contact:</strong> {profile.contact || "—"}</p>
          <p className= "text-light"><strong>Company:</strong> {profile.company || "—"}</p>
        </div>

        {/* Account Section */}
        <div
          className="card p-4"
          style={{ backgroundColor: "#0b2f36", border: "1px solid #17c0c9" }}
        >
          <h5 className="text-danger">🔐 Account Actions</h5>

          <button
            className="btn btn-danger mt-3"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Fixed Footer */}
      <div
        className="text-center mt-4 pt-3"
        style={{
          borderTop: "1px solid #17c0c9",
          fontSize: "14px"
        }}
      >
        © 2026 CertifyX • Admin Settings Panel
      </div>
    </div>
  );
}
