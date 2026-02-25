import React, { useState } from "react";
import axios from "axios";
import "../styles/theme.css";

export default function VerifyCertificate() {
  const [certId, setCertId] = useState("");
  const [result, setResult] = useState(null);

  const verify = async () => {
    const cleanedCertId = certId.trim(); // ✅ FIX: remove leading/trailing spaces

    if (!cleanedCertId) {
      setResult({ valid: false });
      return;
    }

    try {
      const res = await axios.get(
        `http://localhost:5000/api/certificates/verify/${encodeURIComponent(cleanedCertId)}`
      );
      setResult(res.data);
    } catch (err) {
      console.error("Verify API error:", err);
      setResult({ valid: false });
    }
  };

  return (
    <div className="theme-dark-cyan min-vh-100">
      <div className="container text-ltigh py-5">
        <h2>Verify Certificate</h2>

        <input
          className="form-control my-3"
          placeholder="Enter Certificate ID"
          value={certId}
          onChange={(e) => setCertId(e.target.value)}
        />

        <button className="btn btn-info" onClick={verify}>
          Verify
        </button>

        {result && (
          <div className="mt-4">
            {result.valid ? (
              <div className="alert alert-success">
                <p><b>Name:</b> {result.certificate.name}</p>
                <p><b>Course:</b> {result.certificate.course}</p>
                <p><b>Certificate ID:</b> {result.certificate.certificateId}</p>
              </div>
            ) : (
              <div className="alert alert-danger">
                Certificate not valid
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
