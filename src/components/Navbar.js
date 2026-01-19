import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Navbar() {
  return (
    <motion.nav
      className="navbar navbar-expand-lg px-4"
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
      style={{ background: "#021a1f" }}
    >
      <Link className="navbar-brand text-info fw-bold" to="/">
        CertifyX
      </Link>

      <button
        className="navbar-toggler bg-info"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#nav"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="nav">
        <ul className="navbar-nav ms-auto">
          <li className="nav-item">
            <Link className="nav-link text-light" to="/verify">
              Verify
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link text-light" to="/login">
              Login
            </Link>
          </li>
          <li className="nav-item">
            <Link className="btn btn-cyan ms-2" to="/register">
              Get Started
            </Link>
          </li>
        </ul>
      </div>
    </motion.nav>
  );
}
