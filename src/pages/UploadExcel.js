import React, { useState } from "react";
import * as XLSX from "xlsx";
import { motion } from "framer-motion";

export default function UploadExcel() {
  const [data, setData] = useState([]);
  const [fileName, setFileName] = useState("");

  const handleFile = (e) => {
    const file = e.target.files[0];
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const workbook = XLSX.read(bstr, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      setData(jsonData);
    };
    reader.readAsBinaryString(file);
  };

  return (
    <motion.div
      className="container mt-5 fade-in"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h2 className="text-info mb-4">Upload Certificate Excel</h2>

      <div className="card p-4 mb-4">
        <input
          type="file"
          accept=".xlsx,.xls"
          className="form-control"
          onChange={handleFile}
        />
        {fileName && (
          <p className="mt-2 text-success">Uploaded: {fileName}</p>
        )}
      </div>

      {data.length > 0 && (
        <div className="card p-3">
          <h5 className="text-info mb-3">Preview Data</h5>

          <div className="table-responsive">
            <table className="table table-dark table-bordered">
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

          <button className="btn btn-cyan mt-3">
            Save to Database
          </button>
        </div>
      )}
    </motion.div>
  );
}
