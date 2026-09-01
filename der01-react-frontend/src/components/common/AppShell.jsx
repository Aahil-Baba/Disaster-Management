import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogOut, Menu, X, Map, Camera, Activity, LayoutDashboard, Siren } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Logo } from "./Logo";

export function AppShell({ role, children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const userLinks = [
    { to: "/user/dashboard", label: "Home", icon: LayoutDashboard },
    { to: "/user/report", label: "Report", icon: Camera },
    { to: "/user/map", label: "Live Map", icon: Map },
    { to: "/user/status", label: "My Status", icon: Activity },
  ];

  const adminLinks = [
    { to: "/admin/dashboard", label: "Response Center", icon: LayoutDashboard },
    { to: "/admin/incidents", label: "Incidents", icon: Siren },
  ];

  const links = role === "admin" ? adminLinks : userLinks;

  function signOut() {
    logout();
    navigate(role === "admin" ? "/admin/login" : "/user/login");
  }

  return (
    <div className={`app-shell ${role === "admin" ? "admin-shell" : "user-shell"}`}>
      <header className="topbar">
        <Logo />
        <div className="topbar-title">{role === "admin" ? "Emergency Response Center" : "Citizen Safety Portal"}</div>
        <button className="mobile-menu" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X /> : <Menu />}
        </button>
        <nav className={`nav-links ${open ? "nav-open" : ""}`}>
          {links.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={location.pathname === to || location.pathname.startsWith(to + "/") ? "active" : ""}
              onClick={() => setOpen(false)}
            >
              <Icon size={17} /> {label}
            </Link>
          ))}
          <div className="nav-user">
            <span>{user?.name || "User"}</span>
            <button onClick={signOut}><LogOut size={16} /> Logout</button>
          </div>
        </nav>
      </header>
      <main className="page-container">{children}</main>
    </div>
  );
}
