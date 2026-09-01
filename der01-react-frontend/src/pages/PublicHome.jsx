import React from "react";
import { Link } from "react-router-dom";
import { Camera, Map, ShieldCheck, Siren } from "lucide-react";
import { Logo } from "../components/common/Logo";

export function PublicHome() {
  return (
    <div className="landing">
      <header className="landing-nav"><Logo /><div><Link className="nav-quiet" to="/user/login">Citizen login</Link><Link className="btn btn-small btn-dark" to="/admin/login">Admin portal</Link></div></header>
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow"><Siren size={16} /> DISASTER & EMERGENCY RESPONSE</div>
          <h1>Report what you see.<br /><span>Help responders act.</span></h1>
          <p>Ground Truth turns real-time citizen observations into location-aware disaster intelligence for emergency response teams.</p>
          <div className="hero-actions"><Link className="btn btn-primary btn-large" to="/user/login"><Camera size={19} /> Report a disaster</Link><Link className="btn btn-outline btn-large" to="/user/login"><Map size={19} /> View incident map</Link></div>
        </div>
        <div className="hero-panel">
          <div className="response-card"><div className="response-live"><span className="live-dot" /> LIVE RESPONSE MAP</div><div className="fake-map"><span className="fake-pin pin-a">!</span><span className="fake-pin pin-b">≋</span><span className="fake-pin pin-c">♨</span><span className="fake-pin pin-d">⚠</span></div><div className="map-mini-legend"><span>🔴 High</span><span>🟡 Moderate</span><span>🟢 Low</span></div></div>
        </div>
      </section>
      <section className="landing-features">
        <div><ShieldCheck /><div><strong>Capture, don't upload</strong><p>Citizen reports use the device camera and current location.</p></div></div>
        <div><Map /><div><strong>Location-aware</strong><p>Active incidents appear on a live operational map.</p></div></div>
        <div><Siren /><div><strong>Response focused</strong><p>Administrators triage, dispatch and resolve incidents.</p></div></div>
      </section>
    </div>
  );
}
