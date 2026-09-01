import React from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { useEffect } from "react";
import { DisasterMarker } from "./DisasterMarker";

function Recenter({ center }) {
  const map = useMap();
  useEffect(() => { if (center) map.setView(center, Math.max(map.getZoom(), 12)); }, [center, map]);
  return null;
}

export function DisasterMap({ reports, center, zoom = 12, admin = false, onOpen }) {
  const fallback = center || [13.0827, 80.2707];
  return (
    <MapContainer center={fallback} zoom={zoom} className="disaster-map" scrollWheelZoom>
      <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Recenter center={center} />
      {reports.map((report) => (
        <DisasterMarker key={report._id} report={report} admin={admin} onOpen={onOpen} />
      ))}
    </MapContainer>
  );
}
