import React, { useEffect, useState } from "react";
import axios from "../../services/api";
import { Container, Card, Table, Button, Form } from "react-bootstrap";

export default function GenerateCertificate() {
  const [certificates, setCertificates] = useState([]);
  const [filteredCerts, setFilteredCerts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const res = await axios.get("/certificates/student");
        
        const savedProfile = JSON.parse(localStorage.getItem("userProfile"));
        const loggedInName = (savedProfile?.name || "").toLowerCase().trim();
        const loggedInEmail = (savedProfile?.email || localStorage.getItem("userEmail") || "").toLowerCase().trim();

        console.log("--- FILTER DEBUG START ---");
        console.log("Logged In As:", { name: loggedInName, email: loggedInEmail });

        const myCerts = res.data.filter((cert, index) => {
          // Check every possible field name the backend might be sending
          const cName = (cert.studentName || cert.name || "").toLowerCase().trim();
          const cEmail = (cert.email || cert.studentEmail || "").toLowerCase().trim();

          const nameMatch = loggedInName !== "" && cName === loggedInName;
          const emailMatch = loggedInEmail !== "" && cEmail === loggedInEmail;

          // LOGGING THE REJECTION REASON
          if (!nameMatch && !emailMatch) {
            console.log(`Cert #${index} Rejected:`, {
              certName: cName || "EMPTY",
              certEmail: cEmail || "EMPTY",
              reason: "No match found for " + loggedInEmail
            });
          } else {
            console.log(`Cert #${index} ACCEPTED:`, { certName: cName, certEmail: cEmail });
          }

          return nameMatch || emailMatch;
        });

        console.log("Final Filtered Count:", myCerts.length);
        console.log("--- FILTER DEBUG END ---");

        setCertificates(myCerts);
        setFilteredCerts(myCerts);
        setLoading(false);

      } catch (err) {
        console.error("Fetch Error:", err);
        setLoading(false);
      }
    };

    fetchCertificates();
  }, []);

  const handleDownload = async (id) => {
  try {
    const token = localStorage.getItem("token"); // 1. Get the token

    const res = await axios.get(
      `http://https://certificate-system-8vqc.onrender.com/api/certificates/student/download/${id}`, 
      { 
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${token}` // 2. Send the token!
        }
      }
    );

    const url = window.URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "certificate.pdf");
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);

  } catch (err) {
    console.error("Download Error:", err);
    alert("Access Denied: Please log in again.");
  }
};

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = certificates.filter(cert =>
      (cert.course || "").toLowerCase().includes(term) ||
      (cert.certificateId || "").toLowerCase().includes(term)
    );
    setFilteredCerts(filtered);
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#063636", padding: "50px 0" }}>
      <Container>
        <Card style={{ backgroundColor: "#0f5c5c", padding: "20px", borderRadius: "15px" }}>
          <h2 className="text-center mb-4" style={{ color: "#b2ffff" }}>My Certificates</h2>
          <Form className="mb-3">
            <Form.Control type="text" placeholder="Search..." value={searchTerm} onChange={handleSearch} />
          </Form>
          {loading ? (
            <p className="text-white">Loading...</p>
          ) : filteredCerts.length === 0 ? (
            <div className="text-center text-white">
              <p>No certificates matched your profile.</p>
              <p style={{ fontSize: "0.8rem", color: "#b2ffff" }}>
                Check console (F12) to see why the filter rejected the data.
              </p>
            </div>
          ) : (
            <Table striped bordered hover variant="dark" responsive>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Course</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredCerts.map(cert => (
                  <tr key={cert._id}>
                    <td>{cert.certificateId || "N/A"}</td>
                    <td>{cert.course || "N/A"}</td>
                    <td>{new Date(cert.generatedAt || cert.createdAt).toLocaleDateString()}</td>
                    <td>
                      <Button variant="info" size="sm" onClick={() => handleDownload(cert._id)}>Download</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card>
      </Container>
    </div>
  );
}
