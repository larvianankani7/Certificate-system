import React from "react";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="theme-dark-cyan min-vh-100">
    <div className="container-fluid py-5 text-light" >
      {/* HERO SECTION */}
      <div className="row align-items-center px-4 " >
        <motion.div
          className="col-md-6 fade-in"
          initial={{ x: -80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <h1 className="fw-bold text-info">
            Certificate Verification System
          </h1>
          <p className="mt-3">
            A secure and efficient platform to generate, verify, and download
            internship certificates with ease using modern MERN stack
            technology.
          </p>
        </motion.div>

        <motion.div
          className="col-md-6 text-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/942/942799.png"
            alt="certificate"
            width="300"
            className="glow"
          />
        </motion.div>
      </div>

      {/* FEATURES */}
      <div className="container mt-5">
        <h3 className="text-center text-info mb-4">Features</h3>

        <div className="row g-4">
          {features.map((f, i) => (
            <motion.div
              className="col-md-4"
              key={i}
              whileHover={{ scale: 1.05 }}
            >
              <div className="card p-4 h-100 fade-in">
                <h5 className="text-info">{f.title}</h5>
                <p className="mt-2 text-light">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
    </div>
  );
}

const features = [
  {
    title: "User Roles & Authentication",
    desc: "Admin and user accounts with secure authentication and role-based access."
  },
  {
    title: "Excel Data Upload",
    desc: "Admins can upload student certificate data using Excel files."
  },
  {
    title: "Certificate Generation",
    desc: "Certificates auto-generated with accurate student details."
  },
  {
    title: "Search & Verification",
    desc: "Students can verify certificates using unique certificate IDs."
  },
  {
    title: "Download as PDF",
    desc: "Download certificates in high-quality printable PDF format."
  },
  {
    title: "Secure & Reliable",
    desc: "Encrypted authentication and robust data validation."
  }
];
