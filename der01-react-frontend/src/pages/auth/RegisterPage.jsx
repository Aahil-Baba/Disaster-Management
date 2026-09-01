import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { RegisterForm } from "../../components/auth/RegisterForm";

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  async function submit(data) {
    try { setError(""); await register(data); navigate("/user/dashboard", { replace: true }); }
    catch (e) { setError(e?.response?.data?.message || e.message || "Unable to create account."); }
  }

  return (
    <div className="auth-page">
      <div className="auth-side"><h1>Create your citizen account.</h1><p>When an incident happens, the reporting flow is designed to get you from camera to submission with minimal steps.</p></div>
      <div className="auth-card"><Link className="back-link" to="/user/login">← Back to sign in</Link><h2>Create account</h2><p className="muted">Your account lets you track the response status of your reports.</p><RegisterForm onSubmit={submit} error={error} /></div>
    </div>
  );
}
