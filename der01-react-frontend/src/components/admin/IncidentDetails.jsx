import React from "react";
import { useState } from "react";
import { MapPin, Clock, ShieldCheck, Truck, CheckCircle2 } from "lucide-react";
import { SeverityBadge } from "../common/SeverityBadge";
import { StatusBadge } from "../common/StatusBadge";

export function IncidentDetails({ report, onStatusChange, onClose }) {
  const [busy, setBusy] = useState(false);
  if (!report) return null;

  async function change(status) {
    setBusy(true);
    try { await onStatusChange(report._id, status); }
    finally { setBusy(false); }
  }

  return (
    <aside className="incident-panel">
      <button className="panel-close" onClick={onClose}>×</button>
      <div className="panel-header">
        <span>Incident {report._id}</span>
        <SeverityBadge severity={report.severity} />
      </div>

      {report.imageUrl ? <img className="incident-image" src={report.imageUrl} alt={report.hazardType} /> : (
        <div className="image-placeholder"><ShieldCheck size={32} /><span>Citizen evidence image</span></div>
      )}

      <h2>{report.hazardType}</h2>
      <div className="detail-grid">
        <div><MapPin size={16} /><span>{report.latitude.toFixed(5)}, {report.longitude.toFixed(5)}</span></div>
        <div><Clock size={16} /><span>{new Date(report.createdAt).toLocaleString()}</span></div>
        <div><ShieldCheck size={16} /><span>{report.confidence == null ? "Pending AI" : `${Math.round(report.confidence * 100)}% AI confidence`}</span></div>
      </div>

      <div className="status-section">
        <span className="section-label">Response status</span>
        <StatusBadge status={report.status} />
      </div>

      {report.description && <p className="incident-description">{report.description}</p>}

      <div className="action-stack">
        {report.status === "not_started" && (
          <button className="btn btn-primary btn-full" disabled={busy} onClick={() => change("in_progress")}><Truck size={18} /> Start rescue</button>
        )}
        {report.status === "in_progress" && (
          <button className="btn btn-success btn-full" disabled={busy} onClick={() => change("resolved")}><CheckCircle2 size={18} /> Mark resolved</button>
        )}
        {report.status === "resolved" && <div className="resolved-message">This incident has been resolved and is no longer shown on the active map.</div>}
      </div>
    </aside>
  );
}
