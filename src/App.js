import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyCertificate from "./pages/VerifyCertificate";
import DownloadCertificate from "./pages/DownloadCertificate";
import UserDashboard from "./pages/UserDashboard";

// User Pages (NEWLY ADDED)
import Profile from "./pages/user/Profile";
import GenerateCertificate from "./pages/user/GenerateCertificate";
import Downloads from "./pages/user/Downloads";
import TrackStatus from "./pages/user/TrackStatus";
import Settings from "./pages/user/Settings";

// Admin
import AdminDashboard from "./admin/AdminDashboard";

// Components
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify" element={<VerifyCertificate />} />
        <Route path="/download" element={<DownloadCertificate />} />

        {/* Admin routes */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* User dashboard */}
        <Route
          path="/user"
          element={
            <ProtectedRoute role="user">
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        {/* User sub-pages (ADDED, NOT REMOVED ANYTHING) */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute role="user">
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/generate-certificate"
          element={
            <ProtectedRoute role="user">
              <GenerateCertificate />
            </ProtectedRoute>
          }
        />

        <Route
          path="/downloads"
          element={
            <ProtectedRoute role="user">
              <Downloads />
            </ProtectedRoute>
          }
        />

        <Route
          path="/track-status"
          element={
            <ProtectedRoute role="user">
              <TrackStatus />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute role="user">
              <Settings />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
