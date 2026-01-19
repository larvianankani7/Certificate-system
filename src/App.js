import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import UploadExcel from "./pages/UploadExcel";
import GenerateCertificate from "./pages/GenerateCertificate";
import VerifyCertificate from "./pages/VerifyCertificate";
import DownloadCertificate from "./pages/DownloadCertificate";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
function App(){
  return(
    <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/admin" element={<AdminDashboard/>}/>
        <Route path="/user" element={<UserDashboard/>}/>
        <Route path="/upload" element={<UploadExcel/>}/>
        <Route path="/generate" element={<GenerateCertificate/>}/>
        <Route path="/verify" element={<VerifyCertificate/>}/>
        <Route path="/download" element={<DownloadCertificate/>}/>
        <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>}/>
        <Route path="/user" element={<ProtectedRoute role="user"><UserDashboard /></ProtectedRoute>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App;
