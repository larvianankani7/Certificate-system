import React, { useState } from "react";
import * as XLSX from "xlsx";
import { motion } from "framer-motion";
import api from "../services/api";

export default function UploadExcel() {
  const [data, setData] = useState([]);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFile = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setFileName(selectedFile.name);

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const workbook = XLSX.read(bstr, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      const jsonData = XLSX.utils.sheet_to_json(worksheet, {
        header: 0,
        defval: "",
        raw: false,
      }).map((row) => {
        const newRow = {};
        Object.keys(row).forEach((key) => {
          newRow[key.trim()] = row[key];
        });
        return newRow;
      });

      setData(jsonData);
    };
    reader.readAsBinaryString(selectedFile);
  };

  // Upload to Backend
  const saveToDatabase = async () => {
    if (!file) return;

    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      if (!token) {
        alert("You are not logged in.");
        return;
      }

      const formData = new FormData();
      formData.append("file", file);

      const res = await api.post("/upload/excel", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Upload success:", res.data);

      alert(res.data.message || "Upload successful");

    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="container mt-5"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-info mb-4">Upload Certificate Excel</h2>

      <div className="card p-4 mb-4 bg-dark text-light shadow-lg">
        <input
          type="file"
          accept=".xlsx,.xls"
          className="form-control"
          onChange={handleFile}
        />
        {fileName && <p className="mt-2 text-success">Uploaded: {fileName}</p>}
      </div>

      {data.length > 0 && (
        <motion.div
          className="card p-3 bg-dark text-light shadow-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h5 className="text-info mb-3">Preview Data</h5>

          <div className="table-responsive">
            <table className="table table-dark table-bordered table-hover">
              <thead>
                <tr>
                  {Object.keys(data[0]).map((key) => (
                    <th key={key}>{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, i) => (
                  <tr key={i}>
                    {Object.values(row).map((val, j) => (
                      <td key={j}>{val}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            className="btn btn-info mt-3"
            onClick={saveToDatabase}
            disabled={loading}
          >
            {loading
              ? "Uploading..."
              : "Save to Database & Generate Certificates"}
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}
