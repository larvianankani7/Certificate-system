import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Card, Table, Form, Button } from "react-bootstrap";

export default function Downloads() {
  const [downloads, setDownloads] = useState([]);
  const [search, setSearch] = useState("");

  // Get profile data for filtering
  const userProfile = JSON.parse(localStorage.getItem("userProfile")) || {};
  const loggedInName = (userProfile.name || "").toLowerCase().trim();
  const loggedInEmail = (userProfile.email || "").toLowerCase().trim();

  useEffect(() => {
    const fetchDownloads = async () => {
      try {
        const res = await axios.get(
          "https://certificate-system-8vqc.onrender.com/api/certificates/student/downloads",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          }
        );

        console.log("Raw Downloads from DB:", res.data);

        // 1. FILTER: Match by Name OR Email
        const myCerts = res.data.filter((item) => {
          const certName = (item.studentName || "").toLowerCase().trim(); // Ensure backend sends studentName
          const certEmail = (item.userEmail || item.email || "").toLowerCase().trim();

          const nameMatch = loggedInName !== "" && certName === loggedInName;
          const emailMatch = loggedInEmail !== "" && certEmail === loggedInEmail;

          return nameMatch || emailMatch;
        });

        // 2. DE-DUPLICATE: Only show the most recent download per Certificate ID
        const uniqueCertsMap = new Map();
        myCerts.forEach(item => {
          // If we haven't seen this certificateId yet, or this entry is newer, add it
          if (!uniqueCertsMap.has(item.certificateId)) {
            uniqueCertsMap.set(item.certificateId, item);
          }
        });

        setDownloads(Array.from(uniqueCertsMap.values()));

      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchDownloads();
  }, [loggedInName, loggedInEmail]);

  const handleDownload = async (item) => {
    try {
      // Use the same robust download logic we fixed earlier
      const res = await axios.get(
        `https://certificate-system-8vqc.onrender.com/api/certificates/student/download/${item.certificateId}`, // Use the ID route
        {
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      const url = window.URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Certificate_${item.course}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

    } catch (err) {
      console.error(err);
      alert("Download failed. Please try again.");
    }
  };

  const filteredDownloads = downloads.filter((d) => {
    const term = search.toLowerCase();
    return (
      d.certificateId?.toLowerCase().includes(term) ||
      d.course?.toLowerCase().includes(term)
    );
  });

  return (
    <div
      style={{
        backgroundColor: "#063636",
        minHeight: "100vh",
        paddingTop: "60px",
        color: "#eaffff"
      }}
    >
      <Container>
        <Card
          className="mx-auto shadow-lg border-0"
          style={{
            maxWidth: "950px",
            backgroundColor: "#0f5c5c",
            borderRadius: "14px"
          }}
        >
          <Card.Body>
            <h2 className="text-uppercase text-info mb-4 text-center">
              📥 My Downloads
            </h2>

            <Form.Control
              type="text"
              placeholder="Search by Certificate ID or Course"
              className="mb-4"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                backgroundColor: "#063636",
                color: "#e0f7f7",
                border: "1px solid #00cccc"
              }}
            />

            <Table bordered hover responsive className="table-dark text-white">
              <thead>
                <tr className="text-uppercase text-info">
                  <th>Certificate ID</th>
                  <th>Course</th>
                  <th>Last Downloaded</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredDownloads.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center">
                      No downloads found
                    </td>
                  </tr>
                ) : (
                  filteredDownloads.map((item, index) => (
                    <tr key={index}>
                      <td style={{ fontSize: '0.85rem' }}>{item.certificateId}</td>
                      <td>{item.course}</td>
                      <td>
                        {new Date(item.downloadedAt).toLocaleDateString()}
                      </td>
                      <td>
                        <Button
                          size="sm"
                          variant="info"
                          onClick={() => handleDownload(item)}
                        >
                          Download
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}
