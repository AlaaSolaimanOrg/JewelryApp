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
    if (allowedRoles && allowedRoles.length > 0) {
      const hasRole = userInfo?.roles?.some((role) =>
        allowedRoles.includes(role)
      );
      if (!hasRole) {
        return <Navigate to="/unauthorized" replace />;
      }
    }
  } catch (error) {
    localStorage.clear();
    sessionStorage.clear();
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
