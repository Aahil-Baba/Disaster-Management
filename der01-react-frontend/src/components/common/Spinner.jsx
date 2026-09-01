import React from "react";
export function Spinner({ label = "Loading..." }) {
  return <div className="spinner-wrap"><span className="spinner" />{label}</div>;
}
