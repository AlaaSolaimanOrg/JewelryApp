import { jwtDecode } from "jwt-decode";
import React, { type JSX } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Loader from "../Loader/Loader";

interface ProtectedRouteProps {
  children: JSX.Element;
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { userInfo, isLoading } = useAuth();
  const accessToken =
    localStorage.getItem("accessToken") ||
    sessionStorage.getItem("accessToken");

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  if (isLoading) {
    return (
      <div>
        <Loader size="large" text="Loading..." className="loader-fullpage" />
      </div>
    );
  }

  try {
    const decoded: any = jwtDecode(accessToken);

    const isExpired = (decoded.exp as number) * 1000 < Date.now();

    if (isExpired) {
      localStorage.clear();
      sessionStorage.clear();
      return <Navigate to="/login" replace />;
    }

    // ✅ Check role authorization
    if (allowedRoles && allowedRoles.length > 0) {
      const hasRole = userInfo?.roles?.some((role) =>
        allowedRoles.includes(role)
      );
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
