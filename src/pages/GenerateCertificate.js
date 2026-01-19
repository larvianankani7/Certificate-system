import React, { useState } from "react";
import CertificateTemplate from "../components/CertificateTemplate";
import { motion } from "framer-motion";
import { generatePDF } from "../services/pdfGenerator";

export default function GenerateCertificate() {
  const [selected, setSelected] = useState(null);

  // TEMP DATA (later from DB)
  const students = [
    {
      certificateId: "CERT-2026-001",
      studentName: "Rahul Sharma",
      domain: "Web Development",
      startDate: "01 Jan 2026",
      endDate: "01 Mar 2026"
    },
    {
      certificateId: "CERT-2026-002",
      studentName: "Ananya Verma",
      domain: "Data Science",
      startDate: "05 Jan 2026",
      endDate: "05 Mar 2026"
    }
  ];

  return (
    <motion.div
      className="container mt-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h2 className="text-info mb-4">Generate Certificate</h2>

      <div className="row">
        {/* STUDENT LIST */}
        <div className="col-md-4">
          <div className="card p-3">
            <h5 className="text-info">Select Student</h5>

            {students.map((s, i) => (
              <button
                key={i}
                className="btn btn-outline-info mb-2"
                onClick={() => setSelected(s)}
              >
                {s.studentName}
              </button>
            ))}
          </div>
        </div>

        {/* CERTIFICATE PREVIEW */}
        <div className="col-md-8">
          {selected ? (
            <div className="card p-3">
                <h5 className="text-info mb-3">Preview</h5>
                <div style={{ overflowX: "auto" }}>
                    <CertificateTemplate data={selected} />
                </div>
                <button className="btn btn-cyan mt-3"
                    onClick={() => generatePDF(
                        "certificate",
                        selected.certificateId)
                    }>
                    Download PDF
                </button>
            </div> ) : (
                <p>Select a student to generate certificate</p>
            )}
        </div>
      </div>
    </motion.div>
  );
}
