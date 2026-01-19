import React, { useState } from "react";
import { motion } from "framer-motion";
import API from "../services/api";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user"
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/register", form);
      alert("Registration successful!");
      window.location.href = "/login";
    } catch (err) {
      alert("Registration failed");
    }
  };

  return (
    <motion.div
      className="container d-flex justify-content-center align-items-center"
      style={{ minHeight: "80vh" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="card p-4 col-md-5">
        <h3 className="text-info text-center mb-3">Create Account</h3>

        <form onSubmit={handleSubmit}>
          <input
            className="form-control mb-3"
            placeholder="Full Name"
            name="name"
            onChange={handleChange}
            required
          />

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

          <select
            className="form-control mb-3"
            name="role"
            onChange={handleChange}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>

          <button className="btn btn-cyan w-100">Register</button>
        </form>
      </div>
    </motion.div>
  );
}
