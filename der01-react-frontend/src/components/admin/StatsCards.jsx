import React from "react";
const items = [["total", "Total incidents"], ["critical", "Critical"], ["high", "High"], ["moderate", "Moderate"], ["low", "Low"]];
export function StatsCards({ stats }) { return <div className="stats-grid">{items.map(([key,label]) => <div className={`stat-card stat-${key}`} key={key}><span>{label}</span><strong>{stats?.[key] ?? 0}</strong></div>)}</div>; }
