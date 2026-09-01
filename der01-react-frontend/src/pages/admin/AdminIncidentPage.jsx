import React from "react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { AppShell } from "../../components/common/AppShell";
import { IncidentDetails } from "../../components/admin/IncidentDetails";
import { api } from "../../services/api";
import { Spinner } from "../../components/common/Spinner";

export function AdminIncidentPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getReport(id).then(r => setReport(r.report || r)).finally(() => setLoading(false));
  }, [id]);

  async function statusChange(reportId, status) {
    const result = await api.updateStatus(reportId, status);
    setReport(result.report);
    if (status === "resolved") setTimeout(() => navigate("/admin/incidents"), 700);
  }

  return (
    <AppShell role="admin">
      <Link className="back-link" to="/admin/incidents"><ArrowLeft size={16} /> Back to incidents</Link>
      {loading ? <Spinner label="Loading incident..." /> : report ? <div className="single-incident"><div className="single-incident-main"><div className="page-heading"><span className="eyebrow">INCIDENT DETAIL</span><h1>{report._id}</h1></div><IncidentDetails report={report} onStatusChange={statusChange} onClose={() => navigate("/admin/incidents")} /></div></div> : <div className="empty-state"><h2>Incident not found</h2></div>}
    </AppShell>
  );
}
