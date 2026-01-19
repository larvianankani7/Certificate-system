import React, { useState } from "react";
import { motion } from "framer-motion";

export default function VerifyCertificate() {
  const [certId, setCertId] = useState("");
  const [result, setResult] = useState(null);

  // TEMP DATA (simulate DB / backend)
  const certificates = [
    {
      certificateId: "CERT-2026-001",
      studentName: "Rahul Sharma",
      domain: "Web Development",
      startDate: "01 Jan 2026",
      endDate: "01 Mar 2026",
      status: "Valid"
    },
    {
      certificateId: "CERT-2026-002",
      studentName: "Ananya Verma",
      domain: "Data Science",
      startDate: "05 Jan 2026",
      endDate: "05 Mar 2026",
      status: "Pending"
    }
  ];

  const handleVerify = () => {
    const cert = certificates.find((c) => c.certificateId === certId);
    setResult(cert || { status: "Invalid" });
  };

  return (
    <motion.div
      className="container mt-5 fade-in"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h2 className="text-info mb-4">Verify Certificate</h2>

      <div className="card p-4 mb-4">
        <input
          type="text"
          placeholder="Enter Certificate ID"
          className="form-control mb-3"
          value={certId}
          onChange={(e) => setCertId(e.target.value)}
        />
        <button className="btn btn-cyan w-100" onClick={handleVerify}>
          Verify
        </button>
      </div>

      {result && (
        <div className="card p-4">
          <h5>Status: 
            <span
              className={
                result.status === "Valid"
                  ? "text-success"
                  : result.status === "Pending"
                  ? "text-warning"
                  : "text-danger"
              }
            >
              {` ${result.status}`}
            </span>
          </h5>

          {result.status !== "Invalid" && (
            <>
              <p><b>Student Name:</b> {result.studentName}</p>
              <p><b>Domain:</b> {result.domain}</p>
              <p><b>Duration:</b> {result.startDate} - {result.endDate}</p>
              <p><b>Certificate ID:</b> {result.certificateId}</p>
            </>
          )}
        </div>
      )}
    </motion.div>
  );
}
