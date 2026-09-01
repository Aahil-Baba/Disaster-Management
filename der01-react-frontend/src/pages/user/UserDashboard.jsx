import React from "react";
import { Link } from "react-router-dom";
import { Camera, Map, Activity, AlertTriangle } from "lucide-react";
import { AppShell } from "../../components/common/AppShell";
import { useAuth } from "../../context/AuthContext";

export function UserDashboard() {
  const { user } = useAuth();
  return (
    <AppShell role="user">
      <div className="dashboard-hero">
        <div><span className="eyebrow">CITIZEN SAFETY PORTAL</span><h1>Stay aware. Report safely.</h1><p>Capture a real-world hazard, share your current location, and let the response team handle the next steps.</p></div>
      </div>
      <div className="quick-grid">
        <Link className="quick-card primary" to="/user/report"><span className="quick-icon"><Camera /></span><h2>Report a disaster</h2><p>Use your camera to capture the hazard and submit your current location.</p><span className="card-action">Start report →</span></Link>
        <Link className="quick-card" to="/user/map"><span className="quick-icon"><Map /></span><h2>View disaster map</h2><p>See active incidents around the response area and their current status.</p><span className="card-action">Open live map →</span></Link>
        <Link className="quick-card" to="/user/status"><span className="quick-icon"><Activity /></span><h2>My report status</h2><p>Track the response status of reports submitted from your account.</p><span className="card-action">Check status →</span></Link>
      </div>
      <div className="safety-note"><AlertTriangle size={20} /><div><strong>In immediate danger?</strong><p>Do not put yourself at risk to capture evidence. Move to a safe location first and follow local emergency guidance.</p></div></div>
    </AppShell>
  );
}
