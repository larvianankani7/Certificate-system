import axios from "axios";

const API = axios.create({
  baseURL: "https://certificate-system-8vqc.onrender.com/api"
});

// Attach token automatically (SAFE)
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export default API;
