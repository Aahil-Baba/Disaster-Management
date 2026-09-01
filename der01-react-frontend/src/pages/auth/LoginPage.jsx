import React from "react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShieldAlert } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { LoginForm } from "../../components/auth/LoginForm";

export function LoginPage({ role = "user" }) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState("");

  async function submit(credentials) {
    try {
      setError("");
      await login(credentials, role);
      navigate(location.state?.from || "/user/dashboard", { replace: true });
    } catch (e) { setError(e?.response?.data?.message || e.message || "Unable to sign in."); }
  }

  return (
    <div className="auth-page">
      <div className="auth-side">
        <div className="auth-brand">
          <ShieldAlert size={30} />
          <span>Ground Truth</span>
        </div>
        <h1>
          {role === "admin"
            ? "Emergency response, in one view."
            : "Report what you see."}
        </h1>
        <p>
          {role === "admin"
            ? "Monitor active incidents, prioritize severity and coordinate response."
            : "A simple way to share verified location context during a disaster."}
        </p>
      </div>
      <div className="auth-card">
        <Link className="back-link" to="/">
          ← Back
        </Link>
        <h2>{role === "admin" ? "Admin sign in" : "Citizen sign in"}</h2>
        <p className="muted">Use your Ground Truth account to continue.</p>
        <LoginForm role={role} onSubmit={submit} error={error} />
        {role === "user" && (
          <p className="auth-footer">
            New here? <Link to="/user/register">Create an account</Link>
          </p>
        )}
      </div>
    </div>
  );
}
