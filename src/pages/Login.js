import React, { useState } from "react";
import { motion } from "framer-motion";
import API from "../services/api"; // Changed from ../../ to ../
import "../styles/theme.css";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", form);
      
      // 1. Set authentication tokens
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      
      // 2. Remember who is logging in
      const userEmail = form.email;
      localStorage.setItem("userEmail", userEmail); 

      // 3. THE FIX: Look into this specific user's vault
      const userVault = localStorage.getItem(`profileData_${userEmail}`);
      
      if (userVault) {
        // If they have saved data, put it in the main display slot for the Dashboard
        localStorage.setItem("userProfile", userVault);
      } else {
        // If they are a brand new user, clear the display slot so they don't see the previous user's name
        localStorage.removeItem("userProfile");
      }

      // Redirect
      if (res.data.role === "admin") {
        window.location.href = "/admin";
      } else {
        window.location.href = "/user";
      }
    } catch (err) {
      const msg = err.response?.data?.msg || "Invalid credentials";
      alert(msg);
    }
  };

  return (
    <div className="theme-dark-cyan min-vh-100">
      <motion.div
        className="container d-flex justify-content-center align-items-center"
        style={{ minHeight: "80vh" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="card p-4 col-md-4">
          <h3 className="text-info text-center mb-3">Login</h3>

          <form onSubmit={handleSubmit}>
            <input
              className="form-control mb-3"
              placeholder="Email"
              name="email"
              type="email"
              onChange={handleChange}
              required
            />

            <input
              className="form-control mb-3"
              placeholder="Password"
              name="password"
              type="password"
              onChange={handleChange}
              required
            />

            <button className="btn btn-cyan w-100">Login</button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}