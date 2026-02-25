import React from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Navbar,
  Nav,
  Button,
  Badge,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../assets/logo.png";
import preview from "../assets/preview.png";

export default function UserDashboard() {
  const storedProfile = JSON.parse(localStorage.getItem("userProfile"));

  const user = {
    name: storedProfile?.name || "Student",
    certificates: [
      {
        id: "CERT-101",
        course: "React Development",
        status: "issued",
        downloaded: true,
      },
      {
        id: "CERT-102",
        course: "Node.js",
        status: "issued",
        downloaded: false,
      },
      {
        id: "CERT-103",
        course: "UI/UX Design",
        status: "pending",
        downloaded: false,
      },
    ],
  };

  const totalIssued = user.certificates.filter(
    (c) => c.status === "issued"
  ).length;

  const totalDownloaded = user.certificates.filter(
    (c) => c.downloaded
  ).length;

  const totalPending = user.certificates.filter(
    (c) => c.status === "pending"
  ).length;

  return (
    <div
      style={{
        backgroundColor: "#063636",
        minHeight: "100vh",
        color: "#eaffff",
        fontFamily: "'Segoe UI', sans-serif",
      }}
    >
      {/* ================= NAVBAR ================= */}
      <Navbar expand="lg" style={{ backgroundColor: "#0a4f4f" }} variant="dark">
        <Container>
          <Navbar.Brand href="/" className="d-flex align-items-center gap-2">
            {/* LOGO IMAGE */}
            <img
              src={logo}
              alt="Website Logo"
              height="40"
            />
            <span
              style={{
                fontWeight: "700",
                fontSize: "22px",
                color: "#00ffff",
              }}
            >
              CERTIFYX
            </span>
          </Navbar.Brand>

          <Navbar.Toggle />
          <Navbar.Collapse>
            <Nav className="ms-auto fw-semibold">
              <Nav.Link href="/profile" target="_blank">Profile</Nav.Link>
              <Nav.Link href="/generate-certificate" target="_blank">
                Generate Certificate
              </Nav.Link>
              <Nav.Link href="/downloads" target="_blank">Downloads</Nav.Link>
              <Nav.Link href="/track-status" target="_blank">
                Track Status
              </Nav.Link>
              <Nav.Link href="/settings" target="_blank">Settings</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* ================= HEADER ================= */}
      <Container className="pt-5 pb-4">
        <h1 className="fw-bold text-light">
          Welcome,{" "}
          <span style={{ color: "#00ffff" }}>{user.name}</span>
        </h1>
        <p style={{ color: "#cceeee" }}>
          Manage, generate, preview and track your certificates in one place.
        </p>
      </Container>

      {/* ================= STATS CARDS ================= */}
      <Container>
        <Row className="g-4">
          <Col md={4}>
            <Card className="shadow border-0 h-100" style={{ backgroundColor: "#0f5c5c" }}>
              <Card.Body>
                <Card.Title style={{ color: "#a8f6f6" }}>📄 ISSUED CERTIFICATES</Card.Title>
                <Card.Text style={{ color: "#d6ffff" }}>
                  Certificates generated for your enrolled courses.
                </Card.Text>
                <h2 style={{ color: "#a8f6f6" }}>
                  {totalIssued} <Badge bg="info">Total</Badge>
                </h2>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="shadow border-0 h-100" style={{ backgroundColor: "#0f5c5c" }}>
              <Card.Body>
                <Card.Title style={{ color: "#a8f6f6" }}>⬇️ DOWNLOADS</Card.Title>
                <Card.Text style={{ color: "#d6ffff" }}>
                  Certificates downloaded by you.
                </Card.Text>
                <h2 style={{ color: "#a8f6f6" }}>
                  {totalDownloaded} <Badge bg="success">Downloaded</Badge>
                </h2>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="shadow border-0 h-100" style={{ backgroundColor: "#0f5c5c" }}>
              <Card.Body>
                <Card.Title style={{ color: "#a8f6f6" }}>⏳ PENDING STATUS</Card.Title>
                <Card.Text style={{ color: "#d6ffff" }}>
                  Certificates awaiting approval.
                </Card.Text>
                <h2 style={{ color: "#a8f6f6" }}>
                  {totalPending} <Badge bg="warning">Pending</Badge>
                </h2>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* ================= CERTIFICATE PREVIEW ================= */}
        <Row className="mt-5">
          <Col md={12}>
            <Card
              className="border-0 shadow"
              style={{ backgroundColor: "#0f5c5c" }}
            >
              <Card.Body>
                <Card.Title className="mb-3" style={{ color: "#a8f6f6" }}>
                  🖼 CERTIFICATE PREVIEW
                </Card.Title>
                <Card.Text style={{ color: "#e6ffff" }}>
                  This is a sample preview of how your certificate will look once
                  it is generated. The actual certificate will include your name,
                  course title, issue date, and a unique verification ID.
                </Card.Text>

                <div
                  style={{
                    border: "2px dashed #00ffff",
                    borderRadius: "10px",
                    padding: "20px",
                    textAlign: "center",
                    backgroundColor: "#084848",
                  }}
                >
                  <img
                    src={preview}
                    alt="Certificate Preview"
                    style={{
                      maxWidth: "100%",
                      borderRadius: "8px",
                    }}
                  />
                  <p className="mt-3 text-muted">
                    * Preview only – final certificate may vary
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* ================= INFO + ACTIONS ================= */}
        <Row className="mt-5">
          <Col md={8} >
            <Card className="border-0 shadow" style={{ backgroundColor: "#0f5c5c" }}>
              <Card.Body>
                <Card.Title style={{ color: "#a8f6f6" }}>📘 ABOUT</Card.Title>
                <Card.Text style={{ color: "#e6ffff" }}>
                  CertifyHub is a digital certificate generation and verification
                  platform built to provide secure, fast, and paperless academic
                  credential management.
                </Card.Text>

                <p style={{ color: "#a8f6f6" }}>
                  🌐 Website:{" "}
                  <a
                    href="https://certificate-system.vercel.app/"
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: "#00ffff", fontWeight: "600" }}
                  >
                    https://certificate-system.vercel.app/
                  </a>
                </p>

                <p style={{ color: "#a8f6f6" }}>
                  🔍 Verification Portal:{" "}
                  <a
                    href="https://certificate-system.vercel.app/verify/"
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: "#00ffff", fontWeight: "600" }}
                  >
                    https://certificate-system.vercel.app/verify/
                  </a>
                </p>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="border-0 shadow h-100" style={{ backgroundColor: "#0f5c5c", color: "#a8f6f6" }}>
              <Card.Body>
                <Card.Title>🛠 QUICK ACTIONS</Card.Title>
                <div className="d-grid gap-3 mt-4">
                  <Button variant="info" href="/generate-certificate" target="_blank">
                    Generate Certificate
                  </Button>
                  <Button variant="secondary" href="/track-status" target="_blank">
                    Track Certificate
                  </Button>
                  <Button variant="outline-light" href="/downloads" target="_blank">
                    Downloads
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* ================= FOOTER ================= */}
      <footer
        style={{
          backgroundColor: "#0a4f4f",
          marginTop: "70px",
          padding: "25px 0",
          color: "#d9ffff",
        }}
      >
        <Container className="text-center">
          <h6 className="fw-bold mb-1">CertifyHub © 2026</h6>
          <p className="mb-1">
            Digital Certificate Generation & Verification Platform
          </p>
          <small>
            Powered by Secure Frontend Architecture • No Paper • No Hassle
          </small>
        </Container>
      </footer>
    </div>
  );
}
