import React from "react";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, ChevronRight } from "lucide-react";
import { AppShell } from "../../components/common/AppShell";
import { SeverityBadge } from "../../components/common/SeverityBadge";
import { StatusBadge } from "../../components/common/StatusBadge";
import { api } from "../../services/api";

export function AdminIncidentsPage() {
  const [reports, setReports] = useState([]);
  const [query, setQuery] = useState("");
  const [severity, setSeverity] = useState("all");

  const load = useCallback(async () => {
    const result = await api.getReports({ severity });
    setReports(result.reports || result);
  }, [severity]);

  useEffect(() => { load(); }, [load]);

  const filtered = reports.filter(r => `${r._id} ${r.hazardType}`.toLowerCase().includes(query.toLowerCase()));

  return (
    <AppShell role="admin">
      <div className="page-heading"><span className="eyebrow">INCIDENT MANAGEMENT</span><h1>Active incidents</h1><p>Open an incident to inspect evidence and manage its response status.</p></div>
      <div className="table-toolbar"><div className="input-icon search-input"><Search size={17} /><input placeholder="Search incident ID or hazard..." value={query} onChange={e => setQuery(e.target.value)} /></div><select value={severity} onChange={e => setSeverity(e.target.value)}><option value="all">All severity</option><option value="very_high">Very high</option><option value="high">High</option><option value="moderate">Moderate</option><option value="low">Low</option></select></div>
      <div className="incident-table">
        <div className="table-head"><span>Incident</span><span>Hazard</span><span>Severity</span><span>Status</span><span>Time</span><span /></div>
        {filtered.map(r => <Link to={`/admin/incidents/${r._id}`} className="table-row" key={r._id}><span className="report-id">{r._id}</span><span>{r.hazardType}</span><span><SeverityBadge severity={r.severity} /></span><span><StatusBadge status={r.status} /></span><span>{new Date(r.createdAt).toLocaleString()}</span><ChevronRight size={17} /></Link>)}
        {!filtered.length && <div className="empty-state compact"><p>No active incidents found.</p></div>}
      </div>
    </AppShell>
  );
}
