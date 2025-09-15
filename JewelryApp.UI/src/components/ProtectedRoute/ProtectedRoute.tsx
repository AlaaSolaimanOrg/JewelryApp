import React, { type JSX } from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const accessToken =
    localStorage.getItem("accessToken") ||
    sessionStorage.getItem("accessToken");

  if (!accessToken) {
    return <Navigate to="/admin/login" replace />;
  }

  try {
    const decoded = jwtDecode(accessToken);
    const isExpired = (decoded.exp as number) * 1000 < Date.now();

    if (isExpired) {
      localStorage.clear();
      sessionStorage.clear();
      return <Navigate to="/admin/login" replace />;
    }
  } catch (error) {
    console.error(error);
    // Invalid token
    localStorage.clear();
    sessionStorage.clear();
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
