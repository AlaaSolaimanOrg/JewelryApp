// axiosConfig.js
import axios from "axios";
import { callRefreshToken } from "../apis/login.api/login.api";
import { checkRequestSucceeded, showError } from "../utils";

console.log("import.meta.env.VITE_API_URL",import.meta.env.VITE_API_URL)
export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: import.meta.env.VITE_API_TIMEOUT,
  headers: { "Content-Type": "application/json" },
});

console.log("import.meta.env.MODE", import.meta.env.MODE);

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

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken =
        localStorage.getItem("refreshToken") ||
        sessionStorage.getItem("refreshToken");

      if (refreshToken) {
        try {
          callRefreshToken({ refreshToken })
            .then((response) => {
              if (checkRequestSucceeded(response.statusCode)) {
                const newAccessToken = response.data.accessToken;
                // Save new token
                if (localStorage.getItem("refreshToken")) {
                  localStorage.setItem("accessToken", newAccessToken);
                } else {
                  sessionStorage.setItem("accessToken", newAccessToken);
                }

                // Retry original request with new token
                originalRequest.headers[
                  "Authorization"
                ] = `Bearer ${newAccessToken}`;
                return axiosInstance(originalRequest);
              } else {
                showError(response?.message);
              }
            })
            .catch((e) => {
              throw e;
            });
        } catch (error) {
          console.error(error);
          console.error("Refresh token expired or invalid. Logging out.");
          localStorage.clear();
          sessionStorage.clear();

          window.location.href = "/login";
        }
      }
    }

    return error?.response;
  }
);

export default axiosInstance;
