// axiosConfig.js
import axios from "axios";
import { callRefreshToken } from "../apis/login.api/login.api";
import { checkRequestSucceeded, showError } from "../utils";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: import.meta.env.VITE_API_TIMEOUT,
  headers: { "Content-Type": "application/json" },
});

// Attach access token from localStorage/sessionStorage to all requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("accessToken") ||
      sessionStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Prevent infinite retry loop
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken =
        localStorage.getItem("refreshToken") ||
        sessionStorage.getItem("refreshToken");

      if (!refreshToken) {
        // No refresh token available, redirect to login
        redirectToLogin();
        return Promise.reject(error);
      }

      try {
        // Use await instead of .then() for better control flow
        const response = await callRefreshToken({ refreshToken });

        console.log("response from refresh token:", response);
        if (checkRequestSucceeded(response.statusCode)) {
          const newAccessToken = response.data.accessToken;

          // Save new token
          if (localStorage.getItem("refreshToken")) {
            localStorage.setItem("accessToken", newAccessToken);
          } else {
            sessionStorage.setItem("accessToken", newAccessToken);
          }

          // Retry original request with new token
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return axiosInstance(originalRequest);
        } else {
          // Refresh token failed, logout user
          showError(response?.message || "Session expired");
          redirectToLogin();
          return Promise.reject(error);
        }
      } catch (error) {
        redirectToLogin();
        return Promise.reject(error);
      }
    }

    // If it's a 401 and we've already retried, or it's not a 401, just return the error
    return Promise.resolve(error?.response || error);
  }
);

// Helper function to handle logout and redirect
function redirectToLogin() {
  localStorage.clear();
  sessionStorage.clear();
  window.location.href = "/login";
}

export default axiosInstance;
