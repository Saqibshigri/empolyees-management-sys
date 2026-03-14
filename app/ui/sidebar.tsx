// components/Sidebar.tsx
"use client";
import React from "react";
import { S } from "@/lib/styles";
import Avatar from "./avatar";
import { ROLE_CFG } from "@/constants/page";

const NAV_ITEMS = [
  { id: "dashboard", icon: "◈", label: "Dashboard" },
  {
    id: "employees",
    icon: "◎",
    label: "Employees",
    roles: ["SUPER_ADMIN", "ADMIN", "HR_MANAGER", "MANAGER"],
  },
  {
    id: "departments",
    icon: "⬡",
    label: "Departments",
    roles: ["SUPER_ADMIN", "ADMIN", "HR_MANAGER"],
  },
  { id: "attendance", icon: "◷", label: "Attendance" },
  {
    id: "payroll",
    icon: "◈",
    label: "Payroll",
    roles: ["SUPER_ADMIN", "ADMIN", "HR_MANAGER"],
  },
  {
    id: "settings",
    icon: "◉",
    label: "Settings",
    roles: ["SUPER_ADMIN", "ADMIN"],
  },
];

interface SidebarProps {
  page: string;
  setPage: (page: string) => void;
  user: any;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ page, setPage, user, onLogout }) => {
  const nav = NAV_ITEMS.filter((n) => !n.roles || n.roles.includes(user.role));
  return (
    <div style={S.sidebar}>
      {/* Logo */}
      <div
        style={{ padding: "20px 16px 16px", borderBottom: "1px solid #1a1a1a" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 34,
              height: 34,
              background: "linear-gradient(135deg,#d4a853,#a07830)",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
              fontWeight: 900,
              color: "#0d0d0d",
              flexShrink: 0,
            }}
          >
            E
          </div>
          <div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 800,
                color: "#e8e0d0",
                letterSpacing: "-0.02em",
              }}
            >
              EMS
            </div>
            <div
              style={{
                fontSize: 10,
                color: "#4a4540",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              Portal
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "12px 8px", overflow: "auto" }}>
        {nav.map((n) => {
          const active = page === n.id;
          return (
            <button
              key={n.id}
              onClick={() => setPage(n.id)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "9px 12px",
                borderRadius: 8,
                border: "none",
                cursor: "pointer",
                marginBottom: 2,
                background: active ? "#1a1a14" : "transparent",
                color: active ? "#d4a853" : "#6b6660",
                fontSize: 13,
                fontWeight: active ? 600 : 400,
                textAlign: "left",
                transition: "all 0.15s",
              }}
            >
              <span style={{ fontSize: 14, opacity: active ? 1 : 0.5 }}>
                {n.icon}
              </span>
              {n.label}
              {active && (
                <div
                  style={{
                    marginLeft: "auto",
                    width: 3,
                    height: 16,
                    background: "#d4a853",
                    borderRadius: 2,
                  }}
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* User */}
      <div style={{ padding: "12px 8px", borderTop: "1px solid #1a1a1a" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 12px",
            borderRadius: 8,
            background: "#0d0d0d",
          }}
        >
          <Avatar name={`${user.firstName} ${user.lastName}`} size={30} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "#c8c0b0",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {user.firstName} {user.lastName}
            </div>
            <div style={{ fontSize: 10, color: "#4a4540" }}>
              {ROLE_CFG[user.role]?.label}
            </div>
          </div>
          <button
            onClick={onLogout}
            title='Sign out'
            style={{ ...S.btnIcon, padding: 4, flexShrink: 0 }}
          >
            ⏏
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
