import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { LoginPage } from "../auth/LoginPage";

export function AdminLoginPage() {
  const { user } = useAuth();
  if (user?.role === "admin") return <Navigate to="/admin/dashboard" replace />;
  return <LoginPage role="admin" />;
}
