import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";

export function RegisterForm({ onSubmit, error }) {
  const [form, setForm] = useState({ username: "", email: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  function update(key, value) { setForm({ ...form, [key]: value }); }

  async function submit(e) {
    e.preventDefault();
    if (form.password !== form.confirmPassword) return;
    setLoading(true);
    try { await onSubmit(form); } finally { setLoading(false); }
  }

  return (
    <form className="auth-form" onSubmit={submit}>
      {error && <div className="alert alert-danger">{error}</div>}
      <label>Full name</label>
      <input value={form.username} onChange={e => update("username", e.target.value)} required />
      <label>Email</label>
      <input value={form.email} onChange={e => update("email", e.target.value)} type="email" required />
      <label>Password</label>
      <input value={form.password} onChange={e => update("password", e.target.value)} type="password" minLength={6} required />
      <label>Confirm password</label>
      <input value={form.confirmPassword} onChange={e => update("confirmPassword", e.target.value)} type="password" minLength={6} required />
      {form.confirmPassword && form.password !== form.confirmPassword && <div className="field-error">Passwords do not match.</div>}
      <button className="btn btn-primary btn-full" disabled={loading || form.password !== form.confirmPassword}>{loading ? "Creating..." : "Create account"}</button>
      <p className="auth-footer">Already have an account? <Link to="/user/login">Sign in</Link></p>
    </form>
  );
}
