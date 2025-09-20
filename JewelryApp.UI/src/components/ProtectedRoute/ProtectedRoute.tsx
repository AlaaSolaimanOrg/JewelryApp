import { jwtDecode } from "jwt-decode";
import React, { type JSX } from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: JSX.Element;
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const accessToken =
    localStorage.getItem("accessToken") ||
    sessionStorage.getItem("accessToken");

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded: any = jwtDecode(accessToken);

    const decodedRoles =
      decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

    const roles = Array.isArray(decodedRoles) ? decodedRoles : [decodedRoles];

    const isExpired = (decoded.exp as number) * 1000 < Date.now();

    if (isExpired) {
      localStorage.clear();
      sessionStorage.clear();
      return <Navigate to="/login" replace />;
    }

    console.log("roles", roles);
    // ✅ Check role authorization
    if (allowedRoles && allowedRoles.length > 0) {
      const hasRole = roles?.some((role) => allowedRoles.includes(role));
      if (!hasRole) {
        return <Navigate to="/unauthorized" replace />; // you can create this page
      }
    }
  } catch (error) {
    console.error(error);
    localStorage.clear();
    sessionStorage.clear();
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
