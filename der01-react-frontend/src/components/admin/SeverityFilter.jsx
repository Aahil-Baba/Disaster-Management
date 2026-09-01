import React from "react";
export function SeverityFilter({ value, onChange }) {
  const options = [["all", "All incidents"], ["Critical", "Critical"], ["High", "High"], ["Moderate", "Moderate"], ["Low", "Low"]];
  return <div className="filter-row">{options.map(([key, label]) => <button key={key} className={`filter-btn ${value === key ? "selected" : ""}`} onClick={() => onChange(key)}>{label}</button>)}</div>;
}
