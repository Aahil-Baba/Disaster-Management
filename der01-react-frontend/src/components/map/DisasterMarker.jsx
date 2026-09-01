import React, { useMemo } from "react";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { SeverityBadge } from "../common/SeverityBadge";
import { StatusBadge } from "../common/StatusBadge";

const colors = {
  critical: "#b91c1c",
  very_high: "#b91c1c",
  high: "#dc2626",
  moderate: "#eab308",
  low: "#16a34a",
};

function getSeverityColor(severity) {
  if (!severity) return "#dc2626";
  const normalized = String(severity).toLowerCase().trim().replace(/\s+/g, "_");
  return colors[normalized] || colors[String(severity).toLowerCase()] || "#dc2626";
}

function markerIcon(report) {
  const color = getSeverityColor(report.severity);
  const type = String(report.hazardType || "").toLowerCase();
  const symbol = type.includes("fire") ? "♨" : type.includes("flood") ? "≋" : "⚠";

  return L.divIcon({
    className: "custom-disaster-marker",
    html: `
      <div class="pin" style="
        background-color: ${color} !important;
        --pin-color: ${color};
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: 3px solid #ffffff;
        box-shadow: 0 0 12px ${color}cc, 0 4px 8px rgba(0,0,0,0.35);
        display: flex;
        align-items: center;
        justify-content: center;
        color: #ffffff;
        font-size: 14px;
        font-weight: bold;
        cursor: pointer;
      ">
        <span style="line-height: 1;">${symbol}</span>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -18],
  });
}

export function DisasterMarker({ report, admin = false, onOpen }) {
  const lat = report.latitude ?? report.location?.coordinates?.[1];
  const lng = report.longitude ?? report.location?.coordinates?.[0];

  const icon = useMemo(() => markerIcon(report), [report]);

  if (lat == null || lng == null) return null;

  return (
    <Marker
      position={[lat, lng]}
      icon={icon}
      eventHandlers={{ click: () => onOpen?.(report) }}
    >
      <Popup>
        <div className="map-popup" style={{ minWidth: "190px", padding: "4px" }}>
          <div className="popup-top" style={{ display: "flex", gap: "6px", marginBottom: "6px" }}>
            <SeverityBadge severity={report.severity} />
            <StatusBadge status={report.status} />
          </div>
          <strong style={{ fontSize: "14px", display: "block", color: "#0f172a" }}>
            {report.hazardType || "Hazard Alert"}
          </strong>
          <span style={{ fontSize: "12px", color: "#64748b", display: "block", margin: "2px 0" }}>
            {new Date(report.createdAt).toLocaleString()}
          </span>
          {report.confidence != null && (
            <span style={{ fontSize: "12px", color: "#334155", display: "block" }}>
              AI confidence: {Math.round(report.confidence * 100)}%
            </span>
          )}
          {admin && (
            <button
              className="btn btn-small btn-dark"
              style={{
                width: "100%",
                marginTop: "10px",
                padding: "6px 10px",
                backgroundColor: "#0f172a",
                color: "#ffffff",
                border: "none",
                borderRadius: "4px",
                fontSize: "12px",
                fontWeight: "600",
                cursor: "pointer",
              }}
              onClick={() => onOpen?.(report)}
            >
              Open incident
            </button>
          )}
        </div>
      </Popup>
    </Marker>
  );
}