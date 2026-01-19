import React, { useState } from "react";
import { motion } from "framer-motion";
import API from "../services/api";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);

      if (res.data.role === "admin") {
        window.location.href = "/admin";
      } else {
        window.location.href = "/user";
      }
    } catch (err) {
      alert("Invalid credentials");
    }
  };

  return (
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
  );
}
