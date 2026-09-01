import React from "react";
import { ShieldAlert } from "lucide-react";
import { Link } from "react-router-dom";

export function Logo({ dark = false }) {
  return (
    <Link className={`logo ${dark ? "logo-dark" : ""}`} to="/">
      <span className="logo-mark"><ShieldAlert size={19} /></span>
      <span>DER-01</span>
    </Link>
  );
}
