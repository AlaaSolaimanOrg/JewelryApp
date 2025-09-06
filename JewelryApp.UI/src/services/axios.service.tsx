// axiosConfig.js
import axios from "axios";
import { API_HEADERS, API_TIMEOUT, API_URL } from "../config/config";

// Create an Axios instance

export const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: API_TIMEOUT,
  headers: API_HEADERS,
});

// Request interceptor (optional)
axiosInstance.interceptors.request.use(
  (config) => {
    // For example, attach token if exists
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor (optional)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle global errors
    if (error.response) {
      console.error("API Error:", error.response.status, error.response.data);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
