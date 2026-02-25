import React, { useEffect, useState } from "react";
import axios from "../services/api";

export default function Downloads() {
  const [files, setFiles] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      // ✅ Get only logged-in admin uploads
      const res = await axios.get("/upload");
      
      // Format data to match your existing UI structure
      const formatted = res.data.map(upload => ({
        _id: upload._id,
        name: upload.fileName,
        type: "Excel",
        path: `/upload/download/${upload._id}`
      }));

      setFiles(formatted);

    } catch (err) {
      console.error(err);
      alert("Failed to fetch downloads");
    }
  };

  const handleDownload = async (fileId) => {
    try {
      const res = await axios.get(`/upload/download/${fileId}`, {
        responseType: "blob"
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "excel-file.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();

    } catch (err) {
      console.error(err);
      alert("Download failed");
    }
  };

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(query.toLowerCase()) ||
    file.type.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <h3>Downloads</h3>
      <input
        type="text"
        placeholder="Search by name or type"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="form-control mb-3"
      />
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Download</th>
          </tr>
        </thead>
        <tbody>
          {filteredFiles.map((file) => (
            <tr key={file._id}>
              <td>{file.name}</td>
              <td>{file.type}</td>
              <td>
                <button
                  onClick={() => handleDownload(file._id)}
                  className="btn btn-success btn-sm"
                >
                  Download
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
