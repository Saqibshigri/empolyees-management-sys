// app/dashboard/page.tsx
"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { S } from "@/lib/styles";
import Stat from "@/app/ui/stat";
import Avatar from "@/app/ui/avatar";
import { HEADCOUNT, CHART_COLORS, STATUS_CFG } from "@/constants/page";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
} from "recharts";

const Dashboard = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [employees, setEmployees] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [payrolls, setPayrolls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) {
      router.push("/login");
      return;
    }
    setUser(JSON.parse(stored));
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [empRes, deptRes, payRes] = await Promise.all([
        fetch("/api/employees"),
        fetch("/api/departments"),
        fetch("/api/payroll"),
      ]);
      setEmployees(await empRes.json());
      setDepartments(await deptRes.json());
      setPayrolls(await payRes.json());
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ padding: 20 }}>Loading...</div>;

  const active = employees.filter((e) => e.status === "ACTIVE").length;
  const onLeave = employees.filter((e) => e.status === "ON_LEAVE").length;
  const totalPayroll = payrolls
    .filter((p) => p.month === 1 && p.year === 2025)
    .reduce((a, b) => a + b.netSalary, 0);
  const depBreak = departments.map((d) => ({
    name: d.code,
    total: employees.filter((e) => e.departmentId === d.id).length,
    active: employees.filter(
      (e) => e.departmentId === d.id && e.status === "ACTIVE",
    ).length,
  }));
  const genderData = [
    {
      name: "Male",
      value: employees.filter((e) => e.gender === "MALE").length,
    },
    {
      name: "Female",
      value: employees.filter((e) => e.gender === "FEMALE").length,
    },
  ];
  const statusData = Object.entries(STATUS_CFG)
    .map(([k, v]) => ({
      name: v.label,
      value: employees.filter((e) => e.status === k).length,
      fill: v.dot,
    }))
    .filter((d) => d.value > 0);

  const recent = [...employees]
    .sort(
      (a, b) => new Date(b.hireDate).getTime() - new Date(a.hireDate).getTime(),
    )
    .slice(0, 5);

  const tt = {
    contentStyle: {
      background: "#1a1a1a",
      border: "1px solid #252525",
      borderRadius: 8,
      fontSize: 12,
      color: "#c8c0b0",
    },
    labelStyle: { color: "#d4a853" },
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={S.h1}>Dashboard</h1>
        <p style={S.sub}>
          Welcome back ·{" "}
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))",
          gap: 14,
          marginBottom: 24,
        }}
      >
        <Stat
          label='Total Employees'
          value={employees.length}
          icon='◎'
          color='#d4a853'
        />
        <Stat label='Active Staff' value={active} icon='✦' color='#4ade80' />
        <Stat label='On Leave' value={onLeave} icon='◷' color='#fb923c' />
        <Stat
          label='Departments'
          value={departments.length}
          icon='⬡'
          color='#60a5fa'
        />
        <Stat
          label='Monthly Payroll'
          value={`$${(totalPayroll / 1000).toFixed(0)}K`}
          icon='◈'
          color='#c084fc'
        />
        <Stat
          label='New This Year'
          value={employees.filter((e) => e.hireDate >= "2024-01-01").length}
          icon='↑'
          color='#22d3ee'
          sub='Hired in 2024'
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr",
          gap: 14,
          marginBottom: 14,
        }}
      >
        {/* Headcount trend */}
        <div style={S.card}>
          <h3 style={{ ...S.h2, marginBottom: 18 }}>Headcount Trend</h3>
          <ResponsiveContainer width='100%' height={190}>
            <AreaChart data={HEADCOUNT}>
              <defs>
                <linearGradient id='hc' x1='0' y1='0' x2='0' y2='1'>
                  <stop offset='0%' stopColor='#d4a853' stopOpacity={0.3} />
                  <stop offset='100%' stopColor='#d4a853' stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey='month'
                stroke='#2a2a2a'
                tick={{ fill: "#4a4540", fontSize: 11 }}
              />
              <YAxis
                stroke='#2a2a2a'
                tick={{ fill: "#4a4540", fontSize: 11 }}
              />
              <Tooltip {...tt} />
              <Area
                type='monotone'
                dataKey='count'
                stroke='#d4a853'
                strokeWidth={2}
                fill='url(#hc)'
                dot={{ fill: "#d4a853", r: 3 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Gender */}
        <div style={S.card}>
          <h3 style={{ ...S.h2, marginBottom: 18 }}>Gender Split</h3>
          <ResponsiveContainer width='100%' height={190}>
            <PieChart>
              <Pie
                data={genderData}
                cx='50%'
                cy='50%'
                innerRadius={50}
                outerRadius={75}
                paddingAngle={3}
                dataKey='value'
              >
                {genderData.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i]} />
                ))}
              </Pie>
              <Tooltip {...tt} />
              <Legend
                iconSize={8}
                formatter={(v) => (
                  <span style={{ color: "#8a8070", fontSize: 11 }}>{v}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Status */}
        <div style={S.card}>
          <h3 style={{ ...S.h2, marginBottom: 18 }}>By Status</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {statusData.map((s) => (
              <div
                key={s.name}
                style={{ display: "flex", alignItems: "center", gap: 10 }}
              >
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: s.fill,
                    flexShrink: 0,
                  }}
                />
                <span style={{ fontSize: 12, color: "#8a8070", flex: 1 }}>
                  {s.name}
                </span>
                <span
                  style={{ fontSize: 13, fontWeight: 700, color: "#c8c0b0" }}
                >
                  {s.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {/* Dept breakdown */}
        <div style={S.card}>
          <h3 style={{ ...S.h2, marginBottom: 18 }}>Department Breakdown</h3>
          <ResponsiveContainer width='100%' height={170}>
            <BarChart data={depBreak} barGap={4}>
              <XAxis
                dataKey='name'
                stroke='#2a2a2a'
                tick={{ fill: "#4a4540", fontSize: 11 }}
              />
              <YAxis
                stroke='#2a2a2a'
                tick={{ fill: "#4a4540", fontSize: 11 }}
              />
              <Tooltip {...tt} />
              <Bar
                dataKey='total'
                fill='#2a2a1a'
                radius={[4, 4, 0, 0]}
                name='Total'
              />
              <Bar
                dataKey='active'
                fill='#d4a853'
                radius={[4, 4, 0, 0]}
                name='Active'
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent hires */}
        <div style={S.card}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 16,
            }}
          >
            <h3 style={S.h2}>Recent Hires</h3>
            <span style={{ fontSize: 11, color: "#4a4540" }}>
              Latest {recent.length}
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {recent.map((e) => (
              <div
                key={e.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "9px 0",
                  borderBottom: "1px solid #1a1a1a",
                }}
              >
                <Avatar name={`${e.firstName} ${e.lastName}`} size={30} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{ fontSize: 13, fontWeight: 600, color: "#c8c0b0" }}
                  >
                    {e.firstName} {e.lastName}
                  </div>
                  <div style={{ fontSize: 11, color: "#4a4540" }}>
                    {e.designation}
                  </div>
                </div>
                <div style={{ fontSize: 11, color: "#4a4540" }}>
                  {new Date(e.hireDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
