import React from "react";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  return (
    <div className="container mt-5">
      <h2 className="text-info mb-3">Admin Dashboard</h2>

      <div className="card p-4">
        <Link to="/upload" className="btn btn-cyan mb-2">
          Upload Excel
        </Link>

        <Link to="/generate" className="btn btn-outline-info">
          Generate Certificates
        </Link>
      </div>
    </div>
  );
}
