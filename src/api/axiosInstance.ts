import axios from "axios";
import { getUser } from "../utils/utils";

// Create a reusable Axios instance
const API = axios.create({
  baseURL: 'http://localhost:5000/spedocity/', // 🔁 change this to your backend base URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically attach token from localStorage if it exists
API.interceptors.request.use((config) => {
  
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
