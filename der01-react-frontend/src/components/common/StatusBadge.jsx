import React from "react";
const labels = { VERIFIED: "Verified", LOW_CONFIDENCE: "Low Confidence", INVALID_IMAGE: "Invalid Image", PENDING: "Pending" };
export function StatusBadge({ status }) {
  return <span className={`status-badge status-${String(status || "").toLowerCase()}`}>{labels[status] || status || "Pending"}</span>;
}
