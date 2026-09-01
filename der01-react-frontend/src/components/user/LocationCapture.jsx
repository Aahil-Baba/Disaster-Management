import React from "react";
import { LocateFixed, CheckCircle2, AlertTriangle } from "lucide-react";
import { useLocation } from "../../hooks/useLocation";

export function LocationCapture({ value, onChange }) {
  const { location, error, loading, detectLocation } = useLocation();

  function detect() {
    detectLocation();
  }

  if (location && !value) onChange(location);

  return (
    <div className="location-card">
      <div className="location-icon"><LocateFixed /></div>
      <div className="location-copy">
        <strong>{value ? "Location captured" : "Current location"}</strong>
        <p>{value ? `Accuracy approximately ${Math.round(value.accuracy)} m` : "Your browser will use your current GPS location."}</p>
        {error && <div className="field-error"><AlertTriangle size={15} /> {error}</div>}
      </div>
      {!value ? (
        <button className="btn btn-outline" onClick={detect} disabled={loading}>{loading ? "Detecting..." : "Detect"}</button>
      ) : (
        <CheckCircle2 className="success-icon" />
      )}
    </div>
  );
}
