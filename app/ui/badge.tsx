// components/ui/Badge.tsx
import React from "react";
import { STATUS_CFG, ROLE_CFG } from "@/constants/page";

interface BadgeProps {
  status: string;
  cfg?: { label: string; dot?: string };
}

const Badge: React.FC<BadgeProps> = ({ status, cfg }) => {
  const config = cfg || STATUS_CFG[status] || { label: status, dot: "#6b6660" };
  return (
    <span
      style={{
        background: `${config.dot || "#6b6660"}22`,
        color: config.dot || "#6b6660",
        padding: "2px 10px",
        borderRadius: 20,
        fontSize: 11,
        fontWeight: 600,
        display: "inline-block",
      }}
    >
      {config.label}
    </span>
  );
};

export default Badge;
