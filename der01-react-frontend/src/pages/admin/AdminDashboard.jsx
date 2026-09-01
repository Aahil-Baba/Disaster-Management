import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppShell } from "../../components/common/AppShell";
import { StatsCards } from "../../components/admin/StatsCards";
import { SeverityFilter } from "../../components/admin/SeverityFilter";
import { DisasterMap } from "../../components/map/DisasterMap";
import { MapLegend } from "../../components/map/MapLegend";
import { IncidentDetails } from "../../components/admin/IncidentDetails";
import { api } from "../../services/api";
import { useSocket } from "../../hooks/useSocket";
import { Spinner } from "../../components/common/Spinner";

export function AdminDashboard() {
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState({});
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [r, s] = await Promise.all([api.getReports(), api.getStats()]);
      const fetchedReports = r.reports || r || [];
      setReports(fetchedReports);
      setStats(s || {});
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Only display active (unresolved) incidents on the map and queue
  const visible = useMemo(() => {
    const active = reports.filter(
      (r) => (r.status || "").toLowerCase() !== "resolved",
    );
    if (filter === "all") return active;
    return active.filter(
      (r) => (r.severity || "").toLowerCase() === filter.toLowerCase(),
    );
  }, [reports, filter]);

  // Compute live active metrics based on unresolved incidents
  const activeStats = useMemo(() => {
    const active = reports.filter(
      (r) => (r.status || "").toLowerCase() !== "resolved",
    );
    return {
      total: active.length,
      critical: active.filter(
        (r) => (r.severity || "").toLowerCase() === "critical",
      ).length,
      high: active.filter((r) => (r.severity || "").toLowerCase() === "high")
        .length,
      moderate: active.filter(
        (r) => (r.severity || "").toLowerCase() === "moderate",
      ).length,
      low: active.filter((r) => (r.severity || "").toLowerCase() === "low")
        .length,
    };
  }, [reports]);

  const onNew = useCallback((report) => {
    setReports((prev) => [
      report,
      ...prev.filter((r) => (r._id || r.id) !== (report._id || report.id)),
    ]);
  }, []);

  const onStatus = useCallback((updated) => {
    const targetId = updated._id || updated.id;
    setReports((prev) =>
      prev.map((r) => ((r._id || r.id) === targetId ? updated : r)),
    );
    setSelected((prev) =>
      (prev?._id || prev?.id) === targetId ? updated : prev,
    );
  }, []);

  useSocket({ onNewReport: onNew, onStatusUpdated: onStatus });

  async function statusChange(id, status) {
    const result = await api.updateStatus(id, status);
    onStatus(result.report || result);
  }

  return (
    <AppShell role="admin">
      <div className="admin-heading">
        <div>
          <span className="eyebrow">LIVE RESPONSE CENTER</span>
          <h1>Active incident overview</h1>
          <p>
            Prioritize the most severe active incidents and move them through
            the response lifecycle.
          </p>
        </div>
        <div className="live-pill">
          <span className="live-dot" /> Socket live
        </div>
      </div>

      <StatsCards stats={activeStats} />

      <div className="admin-map-toolbar">
        <SeverityFilter value={filter} onChange={setFilter} />
        <span className="result-count">{visible.length} active incidents</span>
      </div>

      <div className="admin-map-layout">
        <div className="map-shell admin-map">
          <DisasterMap
            reports={visible}
            selectedIncident={selected}
            center={[13.0827, 80.2707]}
            admin
            onOpenIncident={setSelected}
            onOpen={setSelected}
          />
          <MapLegend />
          {loading && (
            <div className="map-loading">
              <Spinner label="Loading..." />
            </div>
          )}
        </div>

        <div className="incident-queue">
          <div className="queue-head">
            <strong>Priority queue</strong>
            <button
              className="btn btn-small btn-outline"
              onClick={() => navigate("/admin/incidents")}
            >
              View all
            </button>
          </div>
          {visible.slice(0, 7).map((r) => {
            const id = r._id || r.id;
            const isSelected = (selected?._id || selected?.id) === id;
            return (
              <button
                className={`queue-item ${isSelected ? "active" : ""}`}
                key={id}
                onClick={() => setSelected(r)}
              >
                <span
                  className={`queue-severity ${(r.severity || "").toLowerCase()}`}
                />
                <span className="queue-copy">
                  <strong>{r.hazardType}</strong>
                  <small>
                    {id.slice(-8)} ·{" "}
                    {new Date(r.createdAt).toLocaleTimeString()}
                  </small>
                </span>
              </button>
            );
          })}
          {!visible.length && (
            <div className="empty-mini">
              No active incidents match this filter.
            </div>
          )}
        </div>
      </div>

      {selected && (
        <IncidentDetails
          report={selected}
          onStatusChange={statusChange}
          onClose={() => setSelected(null)}
        />
      )}
    </AppShell>
  );
}
