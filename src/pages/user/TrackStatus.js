import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Card, Row, Col, Badge } from "react-bootstrap";

export default function TrackStatus() {
  const [certs, setCerts] = useState([]);

  const userProfile = JSON.parse(localStorage.getItem("userProfile")) || {};
  const loggedInName = (userProfile.name || "").toLowerCase().trim();
  const loggedInEmail = (userProfile.email || "").toLowerCase().trim();

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await axios.get(
          "https://certificate-system-8vqc.onrender.com/api/certificates/student",
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );

        // 1. FILTER: Match only this student's records
        const myCerts = res.data.filter((cert) => {
          const cName = (cert.studentName || "").toLowerCase().trim();
          const cEmail = (cert.email || "").toLowerCase().trim();
          
          // Don't show "EMPTY" ghost records from failed tests
          if (cName === "empty" || cName === "") return false;

          return (loggedInName !== "" && cName === loggedInName) || 
                 (loggedInEmail !== "" && cEmail === loggedInEmail);
        });

        // 2. SORT: Newest first
        myCerts.sort((a, b) => new Date(b.generatedAt) - new Date(a.generatedAt));

        setCerts(myCerts);
      } catch (err) {
        console.error("Fetch Status Error:", err);
      }
    };

    fetchStatus();
  }, [loggedInName, loggedInEmail]);

  return (
    <div style={{ backgroundColor: "#063636", minHeight: "100vh", padding: "50px 0" }}>
      <Container>
        <h2 className="text-center text-info mb-4">Track Certificate Status</h2>
        <Row>
          {certs.length === 0 ? (
            <Col className="text-center text-white">
              <p>No certificates found for your profile.</p>
            </Col>
          ) : (
            certs.map((cert) => {
              // ACCURATE STATUS LOGIC:
              // It is ONLY generated if it has a valid pdfPath and a certificateId UUID
              const isGenerated = cert.pdfPath && cert.certificateId;
              
              const statusColor = isGenerated ? "success" : "warning";
              const statusText = isGenerated ? "✅ Generated" : "⏳ Pending";

              return (
                <Col md={4} key={cert._id} className="mb-4">
                  <Card 
                    style={{ 
                      backgroundColor: "#0f5c5c", 
                      color: "white", 
                      border: `1px solid ${isGenerated ? "#00cccc" : "#ffc107"}`,
                      borderRadius: "14px",
                      transition: "0.3s"
                    }}
                    className="shadow-lg h-100"
                  >
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <Card.Title className="text-info m-0" style={{fontSize: '1.2rem'}}>
                          {cert.course}
                        </Card.Title>
                        <Badge bg={statusColor}>{statusText}</Badge>
                      </div>

                      <Card.Text className="mb-2" style={{fontSize: '0.9rem'}}>
                        <strong>Certificate ID:</strong> <br/>
                        <span className="text-light">{isGenerated ? cert.certificateId : "Awaiting Generation"}</span>
                      </Card.Text>

                      <Card.Text className="mb-2" style={{fontSize: '0.9rem'}}>
                        <strong>Date:</strong> {cert.generatedAt ? new Date(cert.generatedAt).toLocaleDateString() : "Pending"}
                      </Card.Text>

                      <Card.Text className="mb-3" style={{fontSize: '0.9rem'}}>
                        <strong>Time:</strong> {cert.generatedAt ? new Date(cert.generatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "--:--"}
                      </Card.Text>

                      <div className="pt-2 border-top border-secondary">
                        <small style={{ color: isGenerated ? "#00ffcc" : "#ffdd55" }}>
                          {isGenerated 
                            ? "Verification Complete. Ready to download." 
                            : "Your request is in the queue. Please check back later."}
                        </small>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })
          )}
        </Row>
      </Container>
    </div>
  );
}
