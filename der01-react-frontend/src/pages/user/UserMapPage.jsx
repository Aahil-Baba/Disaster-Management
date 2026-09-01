import React from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AppShell } from "../../components/common/AppShell";
import { DisasterMap } from "../../components/map/DisasterMap";
import { MapLegend } from "../../components/map/MapLegend";
import { SeverityBadge } from "../../components/common/SeverityBadge";
import { StatusBadge } from "../../components/common/StatusBadge";
import { api } from "../../services/api";
import { useSocket } from "../../hooks/useSocket";
import { Spinner } from "../../components/common/Spinner";

export function UserMapPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try { const result = await api.getReports(); setReports(result.reports || result); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const onNew = useCallback((report) => {
    if (report.status !== "resolved") setReports(prev => [report, ...prev.filter(r => r._id !== report._id)]);
  }, []);

  const onStatus = useCallback((updated) => {
    setReports(prev => updated.status === "resolved" ? prev.filter(r => r._id !== updated._id) : prev.map(r => r._id === updated._id ? updated : r));
  }, []);

  useSocket({ onNewReport: onNew, onStatusUpdated: onStatus });

  const center = useMemo(() => reports[0] ? [reports[0].latitude, reports[0].longitude] : [13.0827, 80.2707], [reports]);

  return (
    <AppShell role="user">
      <div className="map-page-header"><div><span className="eyebrow">LIVE INCIDENT MAP</span><h1>Active disaster reports</h1><p>Only active incidents are shown. Resolved incidents leave the operational map.</p></div><div className="live-pill"><span className="live-dot" /> Live</div></div>
      <div className="map-shell"><DisasterMap reports={reports} center={center} /><MapLegend />{loading && <div className="map-loading"><Spinner label="Loading incidents..." /></div>}
        {selected && <div className="map-detail-card"><button onClick={() => setSelected(null)} className="panel-close">×</button><SeverityBadge severity={selected.severity} /><h3>{selected.hazardType}</h3><StatusBadge status={selected.status} /><p>Reported {new Date(selected.createdAt).toLocaleString()}</p><p>{selected.description}</p></div>}
      </div>
      <div className="map-note"><strong>Safety first.</strong> Map information is intended for awareness and should not replace official emergency instructions.</div>
    </AppShell>
  );
}
