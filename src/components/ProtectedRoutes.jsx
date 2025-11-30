// src/components/ProtectedRoutes.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role") || "guest";
  const location = useLocation();

  // 1️⃣ Not logged in → send to login, but remember where user wanted to go
  if (!token) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  // 2️⃣ Logged in but not allowed for this route
  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    // If it's a vendor/admin route, push them to home
    return <Navigate to="/" replace />;
  }

  // 3️⃣ Allowed → render children
  return children;
}
