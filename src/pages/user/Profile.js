import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Profile({ setDashboardName }) {
  const [editMode, setEditMode] = useState(false);

  // 1. Get the email of the person who just logged in
  const currentEmail = localStorage.getItem("userEmail") || "guest";
  // 2. Create a specific backup vault for this user (e.g., profileData_harshit@email.com)
  const userVaultKey = `profileData_${currentEmail}`;

  const [profile, setProfile] = useState({
    name: "",
    email: currentEmail !== "guest" ? currentEmail : "", // Pre-fill their email
    contact: "",
    portfolio: "",
    photo: "",
    signature: "",
    certifications: [{ course: "", organization: "" }],
    education: [{ degree: "", institute: "", score: "", skills: "" }],
  });

  useEffect(() => {
    // 3. Look in their specific vault FIRST
    const savedProfile = JSON.parse(localStorage.getItem(userVaultKey));
    
    if (savedProfile) {
      setProfile(savedProfile);
      if (savedProfile.name && setDashboardName) {
        setDashboardName(savedProfile.name);
      }
      // IMPORTANT: Copy it to the generic key so your Dashboard doesn't break on refresh!
      localStorage.setItem("userProfile", JSON.stringify(savedProfile));
    } else {
      // If no data exists for this specific user, clear the generic key so they see a blank slate
      localStorage.removeItem("userProfile");
      if (setDashboardName) setDashboardName(""); 
    }
  }, [userVaultKey, setDashboardName]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleCertificationChange = (index, field, value) => {
    const newCerts = [...profile.certifications];
    newCerts[index][field] = value;
    setProfile((prev) => ({ ...prev, certifications: newCerts }));
  };

  const addCertification = () => {
    setProfile((prev) => ({
      ...prev,
      certifications: [...prev.certifications, { course: "", organization: "" }],
    }));
  };

  const deleteCertification = (index) => {
    const newCerts = profile.certifications.filter((_, idx) => idx !== index);
    setProfile((prev) => ({ ...prev, certifications: newCerts }));
  };

  const handleEducationChange = (index, field, value) => {
    const newEdu = [...profile.education];
    newEdu[index][field] = value;
    setProfile((prev) => ({ ...prev, education: newEdu }));
  };

  const addEducation = () => {
    setProfile((prev) => ({
      ...prev,
      education: [...prev.education, { degree: "", institute: "", score: "", skills: "" }],
    }));
  };

  const deleteEducation = (index) => {
    const newEdu = profile.education.filter((_, idx) => idx !== index);
    setProfile((prev) => ({ ...prev, education: newEdu }));
  };

  const handleFileUpload = (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    const img = new Image();
    const reader = new FileReader();

    reader.onload = (event) => {
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_SIZE = 150;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        const resizedDataUrl = canvas.toDataURL("image/jpeg", 0.7);
        setProfile((prev) => ({ ...prev, [field]: resizedDataUrl }));
      };
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    try {
      const safeProfile = { ...profile };
      
      // 4. Save to BOTH the generic key (for Dashboard) AND the specific vault (to remember this user)
      localStorage.setItem("userProfile", JSON.stringify(safeProfile));
      localStorage.setItem(userVaultKey, JSON.stringify(safeProfile));
      
      setEditMode(false);
      alert("Profile updated successfully!");
      if (profile.name && setDashboardName) {
        setDashboardName(profile.name);
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to save profile. Image might be too large.");
    }
  };

  const viewTextStyle = { color: "#b2ffff", fontSize: "1.1rem", lineHeight: "1.6" };

  return (
    <div
      style={{
        backgroundColor: "#063636",
        minHeight: "100vh",
        color: "#eaffff",
        paddingBottom: "60px",
        animation: "fadeIn 0.6s ease-in",
      }}
    >
      <Container className="pt-5">
        <Card
          className="shadow-lg border-0 mx-auto"
          style={{ maxWidth: "950px", backgroundColor: "#0f5c5c", borderRadius: "14px" }}
        >
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="fw-bold text-uppercase">👤 PROFILE</h2>
              <Button variant={editMode ? "secondary" : "info"} onClick={() => setEditMode(!editMode)}>
                {editMode ? "Cancel" : "Edit"}
              </Button>
            </div>

            {profile.photo && (
              <div className="text-center mb-4">
                <img
                  src={profile.photo}
                  alt="profile"
                  style={{
                    width: "120px",
                    height: "120px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "3px solid #00cccc",
                  }}
                />
              </div>
            )}
            {editMode && (
              <div className="text-center mb-4">
                <Form.Control type="file" onChange={(e) => handleFileUpload(e, "photo")} />
              </div>
            )}

            <h5 className="mb-3 text-uppercase text-info">PERSONAL INFORMATION</h5>
            {editMode ? (
              <Row className="g-3 mb-4">
                <Col md={6}>
                  <Form.Label className="text-light">NAME</Form.Label>
                  <Form.Control
                    name="name"
                    value={profile.name}
                    onChange={handleChange}
                    style={{ color: "#e0f7f7", backgroundColor: "#0f5c5c" }}
                  />
                </Col>
                <Col md={6}>
                  <Form.Label className="text-light">EMAIL</Form.Label>
                  <Form.Control
                    name="email"
                    value={profile.email}
                    onChange={handleChange}
                    style={{ color: "#e0f7f7", backgroundColor: "#0f5c5c" }}
                  />
                </Col>
                <Col md={6}>
                  <Form.Label className="text-light">CONTACT</Form.Label>
                  <Form.Control
                    name="contact"
                    value={profile.contact}
                    onChange={handleChange}
                    style={{ color: "#e0f7f7", backgroundColor: "#0f5c5c" }}
                  />
                </Col>
                <Col md={6}>
                  <Form.Label className="text-light">PORTFOLIO URL</Form.Label>
                  <Form.Control
                    name="portfolio"
                    value={profile.portfolio}
                    onChange={handleChange}
                    style={{ color: "#e0f7f7", backgroundColor: "#0f5c5c" }}
                  />
                </Col>
              </Row>
            ) : (
              <div className="mb-4" style={viewTextStyle}>
                <p><strong>Name:</strong> {profile.name || "-"}</p>
                <p><strong>Email:</strong> {profile.email || "-"}</p>
                <p><strong>Contact:</strong> {profile.contact || "-"}</p>
                <p><strong>Portfolio:</strong> {profile.portfolio || "-"}</p>
              </div>
            )}

            <hr className="my-4" />

            <h5 className="mb-3 text-uppercase text-info d-flex justify-content-between align-items-center">
              CERTIFICATION INFORMATION
              {editMode && (
                <Button size="sm" variant="light" onClick={addCertification}>
                  + ADD
                </Button>
              )}
            </h5>
            {editMode ? (
              profile.certifications.map((cert, idx) => (
                <Row className="g-3 mb-2 align-items-end" key={idx}>
                  <Col md={5}>
                    <Form.Label className="text-light">COURSE</Form.Label>
                    <Form.Control
                      value={cert.course}
                      onChange={(e) => handleCertificationChange(idx, "course", e.target.value)}
                      style={{ color: "#e0f7f7", backgroundColor: "#0f5c5c" }}
                    />
                  </Col>
                  <Col md={5}>
                    <Form.Label className="text-light">ORGANIZATION</Form.Label>
                    <Form.Control
                      value={cert.organization}
                      onChange={(e) => handleCertificationChange(idx, "organization", e.target.value)}
                      style={{ color: "#e0f7f7", backgroundColor: "#0f5c5c" }}
                    />
                  </Col>
                  <Col md={2}>
                    <Button variant="danger" onClick={() => deleteCertification(idx)}>
                      Delete
                    </Button>
                  </Col>
                </Row>
              ))
            ) : (
              <div className="mb-4" style={viewTextStyle}>
                {profile.certifications.map((cert, idx) => (
                  <p key={idx}>
                    <strong>{cert.course || "-"}:</strong> {cert.organization || "-"}
                  </p>
                ))}
              </div>
            )}

            <hr className="my-4" />

            <h5 className="mb-3 text-uppercase text-info d-flex justify-content-between align-items-center">
              EDUCATIONAL INFORMATION
              {editMode && (
                <Button size="sm" variant="light" onClick={addEducation}>
                  + ADD
                </Button>
              )}
            </h5>
            {editMode ? (
              profile.education.map((edu, idx) => (
                <Row className="g-3 mb-2 align-items-end" key={idx}>
                  <Col md={2}>
                    <Form.Label className="text-light">DEGREE</Form.Label>
                    <Form.Select
                      value={edu.degree}
                      onChange={(e) => handleEducationChange(idx, "degree", e.target.value)}
                      style={{ color: "#e0f7f7", backgroundColor: "#0f5c5c" }}
                    >
                      <option value="">SELECT</option>
                      <option>10th</option>
                      <option>12th</option>
                      <option>Diploma</option>
                      <option>UG</option>
                      <option>PG</option>
                      <option>Masters</option>
                      <option>PhD</option>
                      <option>Course</option>
                    </Form.Select>
                  </Col>
                  <Col md={3}>
                    <Form.Label className="text-light">INSTITUTE</Form.Label>
                    <Form.Control
                      value={edu.institute}
                      onChange={(e) => handleEducationChange(idx, "institute", e.target.value)}
                      style={{ color: "#e0f7f7", backgroundColor: "#0f5c5c" }}
                    />
                  </Col>
                  <Col md={2}>
                    <Form.Label className="text-light">SCORE</Form.Label>
                    <Form.Control
                      value={edu.score}
                      onChange={(e) => handleEducationChange(idx, "score", e.target.value)}
                      style={{ color: "#e0f7f7", backgroundColor: "#0f5c5c" }}
                    />
                  </Col>
                  <Col md={3}>
                    <Form.Label className="text-light">SKILLS</Form.Label>
                    <Form.Control
                      value={edu.skills}
                      onChange={(e) => handleEducationChange(idx, "skills", e.target.value)}
                      style={{ color: "#e0f7f7", backgroundColor: "#0f5c5c" }}
                    />
                  </Col>
                  <Col md={2}>
                    <Button variant="danger" onClick={() => deleteEducation(idx)}>
                      Delete
                    </Button>
                  </Col>
                </Row>
              ))
            ) : (
              <div className="mb-4" style={viewTextStyle}>
                {profile.education.map((edu, idx) => (
                  <div key={idx}>
                    <p><strong>Degree:</strong> {edu.degree || "-"}</p>
                    <p><strong>Institute:</strong> {edu.institute || "-"}</p>
                    <p><strong>Score:</strong> {edu.score || "-"}</p>
                    <p><strong>Skills:</strong> {edu.skills || "-"}</p>
                    <hr />
                  </div>
                ))}
              </div>
            )}

            {editMode && (
              <div className="text-center mt-4">
                <Button variant="info" size="lg" onClick={handleSave}>
                  SAVE PROFILE
                </Button>
              </div>
            )}
          </Card.Body>
        </Card>
      </Container>

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
}