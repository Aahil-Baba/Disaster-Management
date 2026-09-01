import React from "react";
const labels = { Critical: "Critical", High: "High", Moderate: "Moderate", Low: "Low" };
export function SeverityBadge({ severity }) {
  const key = String(severity || "").toLowerCase().replace(/\s+/g, "_");
  return <span className={`severity-badge severity-${key}`}>{labels[severity] || severity || "Pending"}</span>;
}
