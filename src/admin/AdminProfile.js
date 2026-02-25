import React, { useEffect, useState } from "react";
import axios from "../services/api";

export default function AdminProfile() {
  const [profile, setProfile] = useState({});
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get("/admin/profile");
      setProfile(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfile({ ...profile, avatar: reader.result });
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  const handleSave = async () => {
    try {
      await axios.put("/admin/profile", profile);
      alert("Profile Saved Successfully ✅");
      setEditMode(false);
      fetchProfile();
    } catch (err) {
      console.error(err);
      alert("Save failed");
    }
  };

  return (
    <div>
      <h3 className="text-info mb-4">👤 Admin Profile</h3>

      <div
        className="card p-4"
        style={{ backgroundColor: "#0b2f36", border: "1px solid #17c0c9" }}
      >
        {/* Avatar */}
        <div className="text-center mb-4">
          {profile.avatar ? (
            <img
              src={profile.avatar}
              alt="avatar"
              style={{
                width: "130px",
                height: "130px",
                borderRadius: "50%",
                border: "3px solid #17c0c9",
                objectFit: "cover"
              }}
            />
          ) : (
            <div
              style={{
                width: "130px",
                height: "130px",
                borderRadius: "50%",
                backgroundColor: "#123f47",
                display: "inline-block"
              }}
            />
          )}

          {editMode && (
            <input
              type="file"
              className="form-control mt-3 text-light"
              style={{ backgroundColor: "#123f47", border: "none" }}
              onChange={handleImageUpload}
            />
          )}
        </div>

        {/* VIEW MODE */}
        {!editMode ? (
          <>
            <div className="row text-light">
              <div className="col-md-6 mb-3">
                <strong>Name:</strong> {profile.name || "—"}
              </div>
              <div className="col-md-6 mb-3">
                <strong>Email:</strong> {profile.email || "—"}
              </div>
              <div className="col-md-6 mb-3">
                <strong>Contact:</strong> {profile.contact || "—"}
              </div>
              <div className="col-md-12 mb-3">
                <strong>About:</strong> {profile.about || "—"}
              </div>
            </div>

            <hr style={{ borderColor: "#17c0c9" }} />

            <h5 className="text-info">💼 Professional Info</h5>

            <p className="text-light"><strong>Company:</strong> {profile.company || "—"}</p>
            <p className="text-light"><strong>Experience:</strong> {profile.experience || "—"}</p>
            <p className="text-light"><strong>Projects:</strong> {profile.projects || "—"}</p>
            <p className="text-light"><strong>Skills:</strong> {profile.skills || "—"}</p>
            <p className="text-light"><strong>Degrees:</strong> {profile.degrees || "—"}</p>

            <button
              className="btn btn-info mt-3"
              onClick={() => setEditMode(true)}
            >
              Edit Profile
            </button>
          </>
        ) : (
          <>
            {/* EDIT MODE */}
            <div className="row text-light">
              {[
                "name",
                "email",
                "contact",
                "about",
                "company",
                "experience",
                "projects",
                "skills",
                "degrees"
              ].map((field) => (
                <div className="col-md-6 mb-3" key={field}>
                  <input
                    type="text"
                    name={field}
                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                    value={profile[field] || ""}
                    onChange={handleChange}
                    className="form-control text-light"
                    style={{
                      backgroundColor: "#123f47",
                      border: "1px solid #17c0c9"
                    }}
                  />
                </div>
              ))}
            </div>

            <button
              className="btn btn-success mt-3"
              onClick={handleSave}
            >
              Save Profile
            </button>
          </>
        )}
      </div>
    </div>
  );
}
