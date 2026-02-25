import React, { useEffect, useState } from "react";
import axios from "../services/api";

export default function Certificates() {
  const [certs, setCerts] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const res = await axios.get("/certificates");
      setCerts(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch certificates");
    }
  };

  const handleDownload = async (id) => {
    try {
      const res = await axios.get(
        `/certificates/student/download/${id}`,   // ✅ FIXED ROUTE
        {
          responseType: "blob"
        }
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "certificate.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();

    } catch (err) {
      console.error(err);
      alert("Download failed");
    }
  };

  const filteredCerts = certs.filter(c =>
    (c.studentName || "").toLowerCase().includes(query.toLowerCase()) ||
    (c.course || "").toLowerCase().includes(query.toLowerCase()) ||
    (c.certificateId || "").toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      <h3>Generated Certificates</h3>

      <input
        type="text"
        placeholder="Search by Name, Course, or Certificate ID"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="form-control mb-3"
      />

      <table className="table table-dark table-bordered mt-3">
        <thead>
          <tr>
            <th>Name</th>
            <th>Course</th>
            <th>Certificate ID</th>
            <th>PDF</th>
          </tr>
        </thead>
        <tbody>
          {filteredCerts.map(c => (
            <tr key={c._id}>
              <td>{c.studentName}</td>
              <td>{c.course}</td>
              <td>{c.certificateId}</td>
              <td>
                {c.pdfPath ? (
                  <button
                    onClick={() => handleDownload(c._id)}
                    className="btn btn-success btn-sm"
                  >
                    Download
                  </button>
                ) : (
                  <span className="text-warning">Not generated</span>
                )}
              </td>
            </tr>
          ))}

          {filteredCerts.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center">
                No certificates found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
}
