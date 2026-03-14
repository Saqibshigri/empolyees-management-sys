// components/ui/Stat.tsx
import React from "react";
import { S } from "@/lib/styles";

interface StatProps {
  label: string;
  value: string | number;
  icon: string;
  color: string;
  sub?: string;
}

const Stat: React.FC<StatProps> = ({ label, value, icon, color, sub }) => {
  return (
    <div style={{ ...S.cardSm, borderLeft: `3px solid ${color}40` }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 6,
        }}
      >
        <span style={{ fontSize: 16, color }}>{icon}</span>
        <span
          style={{
            fontSize: 11,
            color: "#6b6660",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          {label}
        </span>
      </div>
      <div style={{ fontSize: 22, fontWeight: 800, color }}>{value}</div>
      {sub && (
        <div style={{ fontSize: 10, color: "#4a4540", marginTop: 4 }}>
          {sub}
        </div>
      )}
    </div>
  );
};

export default Stat;
