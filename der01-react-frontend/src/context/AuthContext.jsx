import React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../services/api";

const AuthContext = createContext(null);

// Backend returns role as "citizen" | "admin". Frontend routes/ProtectedRoute
// expect "user" | "admin". Normalize here so nothing else has to change.
function normalizeUser(u) {
  if (!u) return u;
  return { ...u, role: u.role === "citizen" ? "user" : u.role };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("der01_user")) || null; }
    catch { return null; }
  });

  useEffect(() => {
    if (user) localStorage.setItem("der01_user", JSON.stringify(user));
    else localStorage.removeItem("der01_user");
  }, [user]);

  async function login(credentials, role) {
    const result = await api.login(credentials, role);
    setUser(normalizeUser(result.user));
    if (result.token) localStorage.setItem("der01_token", result.token);
    return result;
  }

  async function register(data) {
    const result = await api.register(data);
    setUser(normalizeUser(result.user));
    if (result.token) localStorage.setItem("der01_token", result.token);
    return result;
  }

  function logout() {
    setUser(null);
    localStorage.removeItem("der01_token");
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
