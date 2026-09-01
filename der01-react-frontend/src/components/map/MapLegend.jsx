import React from "react";
export function MapLegend() {
  return (
    <div className="map-legend">
      <strong>Severity</strong>
      <span><i className="legend-dot very-high" /> Very High / High</span>
      <span><i className="legend-dot moderate" /> Moderate</span>
      <span><i className="legend-dot low" /> Low</span>
    </div>
  );
}
