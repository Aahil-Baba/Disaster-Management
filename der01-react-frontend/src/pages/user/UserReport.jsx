import React from "react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Camera, MapPin, Send, CheckCircle2 } from "lucide-react";
import { AppShell } from "../../components/common/AppShell";
import { CameraCapture } from "../../components/user/CameraCapture";
import { LocationCapture } from "../../components/user/LocationCapture";
import { api } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

export function UserReport() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [photo, setPhoto] = useState(null);
  const [location, setLocation] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [report, setReport] = useState(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => () => { if (photo?.url) URL.revokeObjectURL(photo.url); }, [photo]);

  async function submit() {
    if (!photo || !location) return;
    setSubmitting(true); setError("");
    const fd = new FormData();
    fd.append("image", photo.blob, "citizen-capture.jpg");
    fd.append("latitude", location.latitude);
    fd.append("longitude", location.longitude);
    fd.append("accuracy", location.accuracy);
    try {
      const result = await api.submitReport(fd);
      setReport(result.report);
      setSubmitted(true);
    } catch (e) { setError(e?.response?.data?.message || e.message || "Submission failed."); }
    finally { setSubmitting(false); }
  }

  if (submitted) return (
    <AppShell role="user">
      <div className="success-page"><div className="success-icon-large"><CheckCircle2 /></div><span className="eyebrow">REPORT RECEIVED</span><h1>Your report was submitted.</h1><p>The response system has received your evidence and location. You can track the report status from your dashboard.</p><div className="report-receipt"><span>Report ID</span><strong>{report?._id}</strong><span>Status</span><strong>Not Started</strong></div><div className="hero-actions"><Link className="btn btn-primary" to="/user/status">View my status</Link><Link className="btn btn-outline" to="/user/map">View map</Link></div></div>
    </AppShell>
  );

  return (
    <AppShell role="user">
      <div className="flow-header"><div><span className="eyebrow">REPORT AN INCIDENT</span><h1>Capture the hazard</h1><p>Use the device camera. Gallery uploads are intentionally disabled.</p></div><div className="stepper"><span className="step active">1</span><i /><span className={`step ${photo ? "active" : ""}`}>2</span><i /><span className={`step ${location ? "active" : ""}`}>3</span></div></div>

      <div className="report-layout">
        <section className="report-main">
          <div className="section-card"><div className="section-heading"><span className="step-number">1</span><div><h2>Capture photo</h2><p>Show the hazard clearly without putting yourself at risk.</p></div></div><CameraCapture onCaptured={setPhoto} /></div>

          <div className="section-card"><div className="section-heading"><span className="step-number">2</span><div><h2>Capture location</h2><p>Use your current device location for the report.</p></div></div><LocationCapture value={location} onChange={setLocation} /></div>

          <div className="section-card review-card"><div className="section-heading"><span className="step-number">3</span><div><h2>Submit report</h2><p>Review the evidence and send it to the response system.</p></div></div><div className="review-summary"><div><Camera size={17} /> {photo ? "Photo ready" : "Photo required"}</div><div><MapPin size={17} /> {location ? "Location ready" : "Location required"}</div></div>{error && <div className="alert alert-danger">{error}</div>}<button className="btn btn-primary btn-large btn-full" disabled={!photo || !location || submitting} onClick={submit}><Send size={19} /> {submitting ? "Submitting..." : "Submit report"}</button></div>
        </section>

        <aside className="report-side"><div className="info-card"><strong>What happens next?</strong><ol><li>Your photo is sent securely to the backend.</li><li>The AI service classifies the hazard and estimates visual severity.</li><li>The incident is placed on the active response map.</li><li>Responders update the status as action is taken.</li></ol></div><div className="info-card muted-card"><strong>Account</strong><p>{user?.email}</p><p className="small">Your report will be associated with your account so you can track its status.</p></div></aside>
      </div>
    </AppShell>
  );
}
