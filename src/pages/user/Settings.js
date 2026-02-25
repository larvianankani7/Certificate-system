import React, { useState, useEffect } from "react";
import { Container, Card, Button, Form, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const navigate = useNavigate();

  const [theme, setTheme] = useState("dark"); // dark / light
  const [notifications, setNotifications] = useState(true);
  const [settings, setSettings] = useState({
    option1: true,
    option2: false,
    option3: true,
  });
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    contact: "",
    course: "",
  });

  // Load saved settings and profile from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("appTheme");
    if (savedTheme) setTheme(savedTheme);

    const savedNotifications = localStorage.getItem("notifications");
    if (savedNotifications !== null) setNotifications(savedNotifications === "true");

    const savedSettings = JSON.parse(localStorage.getItem("userSettings"));
    if (savedSettings) setSettings(savedSettings);

    const savedProfile = JSON.parse(localStorage.getItem("userProfile"));
    if (savedProfile) {
      setProfile({
        name: savedProfile.name || "",
        email: savedProfile.email || "",
        contact: savedProfile.contact || "",
        course: savedProfile.education && savedProfile.education[0]?.degree ? savedProfile.education[0].degree : "",
      });
    }
  }, []);

  const handleThemeToggle = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("appTheme", newTheme);
  };

  const handleNotificationsToggle = () => {
    setNotifications(!notifications);
    localStorage.setItem("notifications", !notifications);
  };

  const handleSettingChange = (e) => {
    const { name, checked } = e.target;
    setSettings((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSave = () => {
    localStorage.setItem("userSettings", JSON.stringify(settings));
    alert("Settings saved successfully!");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userProfile");
    navigate("/"); // redirect to homepage
  };

  const bgColor = theme === "dark" ? "#063636" : "#b2ffff";
  const textColor = theme === "dark" ? "#ffffff" : "#063636";

  const headingStyle = {
    color: "#b2ffff",
    textTransform: "uppercase",
    fontWeight: "bold",
    marginBottom: "15px",
  };

  const sectionStyle = {
    color: textColor,
    fontSize: "1.1rem",
    lineHeight: "1.5",
    marginBottom: "20px",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: bgColor,
        padding: "50px 0",
      }}
    >
      <Container className="d-flex justify-content-center">
        <Card
          className="shadow-lg p-4"
          style={{
            maxWidth: "800px",
            width: "100%",
            borderRadius: "15px",
            backgroundColor: theme === "dark" ? "#0f5c5c" : "#e0f7f7",
          }}
        >
          <h2 style={headingStyle}>Settings</h2>

          {/* Theme Toggle */}
          <div className="mb-3">
            <h5 style={headingStyle}>Theme</h5>
            <Button
              onClick={handleThemeToggle}
              variant={theme === "dark" ? "info" : "secondary"}
            >
              Switch to {theme === "dark" ? "Light Cyan" : "Dark"}
            </Button>
          </div>

          {/* Notifications */}
          <div className="mb-3">
            <h5 style={headingStyle}>Notifications</h5>
            <Form.Check
              type="switch"
              id="notifications-switch"
              label={notifications ? "On" : "Off"}
              checked={notifications}
              onChange={handleNotificationsToggle}
              style={{ color: textColor }}
            />
          </div>

          {/* Profile Info */}
          <div className="mb-3">
            <h5 style={headingStyle}>Profile Info</h5>
            <div style={sectionStyle}>
              <p><strong>Name:</strong> {profile.name || "-"}</p>
              <p><strong>Email:</strong> {profile.email || "-"}</p>
              <p><strong>Contact:</strong> {profile.contact || "-"}</p>
              <p><strong>Course:</strong> {profile.course || "-"}</p>
            </div>
          </div>

          {/* Other Settings Options */}
          <div className="mb-3">
            <h5 style={headingStyle}>Other Settings</h5>
            <Form>
              <Form.Check
                type="switch"
                id="option1"
                label="Music"
                name="option1"
                checked={settings.option1}
                onChange={handleSettingChange}
                style={{ color: textColor }}
              />
              <Form.Check
                type="switch"
                id="option2"
                label="Vibration"
                name="option2"
                checked={settings.option2}
                onChange={handleSettingChange}
                style={{ color: textColor }}
              />
              <Form.Check
                type="switch"
                id="option3"
                label="Sound"
                name="option3"
                checked={settings.option3}
                onChange={handleSettingChange}
                style={{ color: textColor }}
              />
            </Form>
          </div>

          {/* Buttons */}
          <Row className="mt-4">
            <Col className="d-flex justify-content-start">
              <Button variant="info" onClick={handleSave}>
                Save Settings
              </Button>
            </Col>
            <Col className="d-flex justify-content-end">
              <Button variant="danger" onClick={handleLogout}>
                Logout
              </Button>
            </Col>
          </Row>
        </Card>
      </Container>
    </div>
  );
}
