import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { PublicHome } from "./pages/PublicHome";
import { LoginPage } from "./pages/auth/LoginPage";
import { RegisterPage } from "./pages/auth/RegisterPage";
import { UserDashboard } from "./pages/user/UserDashboard";
import { UserReport } from "./pages/user/UserReport";
import { UserMapPage } from "./pages/user/UserMapPage";
import { UserStatusPage } from "./pages/user/UserStatusPage";
import { AdminLoginPage } from "./pages/admin/AdminLoginPage";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminIncidentsPage } from "./pages/admin/AdminIncidentsPage";
import { AdminIncidentPage } from "./pages/admin/AdminIncidentPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicHome />} />
        <Route path="/user/login" element={<LoginPage role="user" />} />
        <Route path="/user/register" element={<RegisterPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />

        <Route element={<ProtectedRoute role="user" />}>
          <Route path="/user" element={<Navigate to="/user/dashboard" replace />} />
          <Route path="/user/dashboard" element={<UserDashboard />} />
          <Route path="/user/report" element={<UserReport />} />
          <Route path="/user/map" element={<UserMapPage />} />
          <Route path="/user/status" element={<UserStatusPage />} />
        </Route>

        <Route element={<ProtectedRoute role="admin" />}>
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/incidents" element={<AdminIncidentsPage />} />
          <Route path="/admin/incidents/:id" element={<AdminIncidentPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
