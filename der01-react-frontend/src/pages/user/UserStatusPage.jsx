import React from "react";
import { useCallback, useEffect, useState } from "react";
import { Activity, Clock, CheckCircle2 } from "lucide-react";
import { AppShell } from "../../components/common/AppShell";
import { SeverityBadge } from "../../components/common/SeverityBadge";
import { StatusBadge } from "../../components/common/StatusBadge";
import { api } from "../../services/api";
import { useSocket } from "../../hooks/useSocket";
import { Spinner } from "../../components/common/Spinner";

function Timeline({ status }) {
  const stages = [
    ["not_started", "Reported", "Your report is received and waiting for response action."],
    ["in_progress", "Rescue in progress", "A response operation has started."],
    ["resolved", "Resolved", "The incident has been marked resolved."],
  ];
  const index = stages.findIndex(s => s[0] === status);
  return <div className="timeline">{stages.map(([key, label, desc], i) => <div className={`timeline-item ${i <= index ? "done" : ""}`} key={key}><div className="timeline-dot">{i <= index ? <CheckCircle2 size={16} /> : i + 1}</div><div><strong>{label}</strong><p>{desc}</p></div></div>)}</div>;
}

export function UserStatusPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try { const result = await api.getMyReports(); setReports(result.reports || result); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const onStatus = useCallback((updated) => setReports(prev => prev.map(r => r._id === updated._id ? updated : r)), []);
  useSocket({ onStatusUpdated: onStatus });

  return (
    <AppShell role="user">
      <div className="page-heading"><span className="eyebrow">MY REPORT STATUS</span><h1>Track your submissions</h1><p>You do not need to manage the incident yourself. This page shows what the response team has done.</p></div>
      {loading ? <Spinner label="Loading your reports..." /> : reports.length === 0 ? <div className="empty-state"><Activity size={30} /><h2>No reports yet</h2><p>When you submit a report, its response status will appear here.</p></div> :
        <div className="status-list">{reports.map(report => <article className="status-card" key={report._id}><div className="status-card-top"><div><span className="report-id">{report._id}</span><h2>{report.hazardType}</h2></div><SeverityBadge severity={report.severity} /></div><div className="status-meta"><span><Clock size={15} /> {new Date(report.createdAt).toLocaleString()}</span><StatusBadge status={report.status} /></div><Timeline status={report.status} /></article>)}</div>}
    </AppShell>
  );
}
