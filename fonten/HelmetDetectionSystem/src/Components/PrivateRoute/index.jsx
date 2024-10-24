import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ element, requiredRole }) => {
  const token = localStorage.getItem("token");
  const userType = localStorage.getItem("userType");
  
  const isAuthenticated = !!token;
  const hasRequiredRole = requiredRole
    ? requiredRole.split(",").includes(userType)
    : true;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!hasRequiredRole) {
    return <Navigate to="/unauthorized" replace />; // หรือหน้าที่บอกว่าไม่มีสิทธิ์เข้าถึง
  }

  return element;
};

export default PrivateRoute;
