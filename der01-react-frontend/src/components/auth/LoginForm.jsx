import React from "react";
import { useState } from "react";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";

export function LoginForm({ role, onSubmit, error }) {
  const [email, setEmail] = useState(role === "admin" ? "admin@der01.local" : "citizen@der01.local");
  const [password, setPassword] = useState(role === "admin" ? "admin123" : "citizen123");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    try { await onSubmit({ email, password }); }
    finally { setLoading(false); }
  }

  return (
    <form className="auth-form" onSubmit={submit}>
      {error && <div className="alert alert-danger">{error}</div>}
      <label>Email</label>
      <div className="input-icon"><Mail size={18} /><input value={email} onChange={e => setEmail(e.target.value)} type="email" required /></div>
      <label>Password</label>
      <div className="input-icon"><Lock size={18} /><input value={password} onChange={e => setPassword(e.target.value)} type={show ? "text" : "password"} required /><button type="button" onClick={() => setShow(!show)}>{show ? <EyeOff size={17} /> : <Eye size={17} />}</button></div>
      <button className="btn btn-primary btn-full" disabled={loading}>{loading ? "Signing in..." : "Sign in"}</button>
    </form>
  );
}
