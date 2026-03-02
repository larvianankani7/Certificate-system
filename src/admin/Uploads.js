import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Uploads() {
  const [uploads, setUploads] = useState([]);

  useEffect(() => {
    axios.get("http://https://certificate-system-8vqc.onrender.com/api/upload")
      .then(res => setUploads(res.data));
  }, []);

  return (
    <>
      <h3>Uploaded Excels</h3>
      <table className="table table-dark table-bordered mt-3">
        <thead>
          <tr>
            <th>File Name</th>
            <th>Date</th>
            <th>Download</th>
          </tr>
        </thead>
        <tbody>
          {uploads.map(u => (
            <tr key={u._id}>
              <td>{u.fileName}</td>
              <td>{new Date(u.uploadedAt).toDateString()}</td>
              <td>
                <a
                  href={`http://localhost:5000/${u.filePath}`}
                  className="btn btn-info btn-sm"
                >
                  Download
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
