import React, { useEffect, useState } from "react";
import axios from "axios";

export default function GenerateCertificate() {
  const [uploads, setUploads] = useState([]);
  const [selectedUpload, setSelectedUpload] = useState(null);
  const [students, setStudents] = useState([]);

  const token = localStorage.getItem("token");

  // Fetch uploads
  useEffect(() => {
    axios
      .get("http://https://certificate-system-8vqc.onrender.com/api/upload", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => setUploads(res.data))
      .catch(err => console.error(err));
  }, [token]);

  // Fetch students when upload selected
  const handleUploadChange = async (id) => {
    if (!id) {
      setStudents([]);
      setSelectedUpload(null);
      return;
    }

    setSelectedUpload(id);

    try {
      const res = await axios.get(
        `http://https://certificate-system-8vqc.onrender.com/api/upload/${id}/students`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setStudents(res.data);
    } catch (err) {
      console.error(err);
      setStudents([]);
    }
  };

  const generateCertificate = async (student) => {
    try {
      // DEBUG: Let's see what we are actually sending
      console.log("Admin Sending Student Data:", student);

      if(!student.name || !student.email) {
          alert("Error: Student name or email is missing!");
          return;
      }

      // Step 1: Generate certificate
      const res = await axios.post(
        "http://https://certificate-system-8vqc.onrender.com/api/certificates/generate",
        {
          name: student.name.trim(),
          email: student.email.trim(),
          course: student.course,
          uploadId: selectedUpload
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const certificateId = res.data.certificateId;
      alert("Certificate entry created! Now attempting to fetch PDF...");

      // Step 2: Download PDF (Wait 1 second to give the server time to write the file)
      setTimeout(async () => {
          try {
              const pdfRes = await axios.get(
                `http://https://certificate-system-8vqc.onrender.com/api/certificates/student/download/${certificateId}`,
                {
                  responseType: "blob",
                  headers: { Authorization: `Bearer ${token}` },
                }
              );

              const url = window.URL.createObjectURL(new Blob([pdfRes.data], {type: 'application/pdf'}));
              const link = document.createElement("a");
              link.href = url;
              link.setAttribute("download", `Certificate_${student.name.replace(/\s+/g, '_')}.pdf`);
              document.body.appendChild(link);
              link.click();
              link.remove();
              window.URL.revokeObjectURL(url);
          } catch (downloadErr) {
              console.error("PDF Fetch error:", downloadErr);
              alert("Certificate record created, but PDF file isn't ready. The student can download it from their profile later.");
          }
      }, 1500); // 1.5 second delay

    } catch (err) {
      console.error("Generation Error:", err);
      alert(err.response?.data?.error || "Certificate generation failed");
    }
  };

  return (
    <div className="container text-light">
      <h2 className="mb-4">Generate Certificate</h2>

      <select
        className="form-control mb-4"
        onChange={(e) => handleUploadChange(e.target.value)}
        defaultValue=""
      >
        <option value="">Select Uploaded Excel</option>
        {uploads.map(upload => (
          <option key={upload._id} value={upload._id}>
            {upload.fileName}
          </option>
        ))}
      </select>

      {students.length > 0 && (
        <table className="table table-dark table-bordered">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Course</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr key={index}>
                <td className="text-uppercase">{student.name}</td>
                <td>{student.email}</td>
                <td>{student.course}</td>
                <td>
                  <button
                    className="btn btn-info btn-sm"
                    onClick={() => generateCertificate(student)}
                  >
                    Generate
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
