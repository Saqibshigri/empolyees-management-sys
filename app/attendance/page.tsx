 // app/attendance/page.tsx
"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Avatar from "@/app/ui/avatar";
import { S } from "@/lib/styles";
import { MONTHS } from "@/constants/page";

const AttendancePage = () => {
  const router = useRouter();
  const [user, setUser] = useState<boolean>(false);
  const [employees, setEmployees] = useState<any[]>([]);
  const [month, setMonth] = useState(1);
  const [year, setYear] = useState(2025);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) {
      router.push("/login");
      return;
    }
    setUser(JSON.parse(stored));
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await fetch("/api/employees");
      setEmployees(await res.json());
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDay = new Date(year, month - 1, 1).getDay();

  // Simulated random attendance (in real app, this would come from API)
  const getStatus = (empId: string, day: number) => {
    const seed = (empId?.charCodeAt(1) || 1) * day * month;
    const r = (seed * 1234567) % 100;
    if (new Date(year, month - 1, day).getDay() === 0 || new Date(year, month - 1, day).getDay() === 6) return "WEEKEND";
    if (r > 92) return "ABSENT";
    if (r > 85) return "LATE";
    if (r > 82) return "ON_LEAVE";
    return "PRESENT";
  };

  const AC = {
    PRESENT: "#4ade80",
    ABSENT: "#f87171",
    LATE: "#fbbf24",
    ON_LEAVE: "#c084fc",
    WEEKEND: "#2a2a2a",
  };

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const summary = employees.slice(0, 6).reduce((a: any, e: any) => {
    days.forEach((d) => {
      const s = getStatus(e.id, d);
      if (s !== "WEEKEND") a[s] = (a[s] || 0) + 1;
    });
    return a;
  }, {});

  if (loading) return <div style={{ padding: 20 }}>Loading...</div>;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
        <div>
          <h1 style={S.h1}>Attendance</h1>
          <p style={S.sub}>{MONTHS[month - 1]} {year}</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <select style={{ ...S.select, width: 110 }} value={month} onChange={(e) => setMonth(Number(e.target.value))}>
            {MONTHS.map((m, i) => <option key={m} value={i+1}>{m}</option>)}
          </select>
          <select style={{ ...S.select, width: 90 }} value={year} onChange={(e) => setYear(Number(e.target.value))}>
            {[2024, 2025].map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </div>

      {/* Summary */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
        {[
          ["Present", summary.PRESENT || 0, "#4ade80"],
          ["Absent", summary.ABSENT || 0, "#f87171"],
          ["Late", summary.LATE || 0, "#fbbf24"],
          ["On Leave", summary.ON_LEAVE || 0, "#c084fc"],
        ].map(([l, v, c]) => (
          <div key={l} style={{ ...S.cardSm, borderLeft: `3px solid ${c}40` }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: c }}>{v}</div>
            <div style={{ fontSize: 11, color: "#6b6660", marginTop: 3 }}>{l}</div>
          </div>
        ))}
      </div>

      {/* Calendar-style grid */}
      <div style={S.card}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 3 }}>
            <thead>
              <tr>
                <th style={{ ...S.th, width: 160 }}>Employee</th>
                {days.map((d) => (
                  <th key={d} style={{ ...S.th, padding: "6px 4px", textAlign: "center", width: 28, fontSize: 10 }}>
                    <div style={{ color: new Date(year, month - 1, d).getDay() === 0 || new Date(year, month - 1, d).getDay() === 6 ? "#2a2a2a" : "#4a4540" }}>
                      {d}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {employees.slice(0, 8).map((e: any) => (
                <tr key={e.id}>
                  <td style={S.td}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <Avatar name={`${e.firstName} ${e.lastName}`} size={24} />
                      <span style={{ fontSize: 12 }}>{e.firstName} {e.lastName[0]}.</span>
                    </div>
                  </td>
                  {days.map((d) => {
                    const s = getStatus(e.id, d);
                    return (
                      <td key={d} style={{ ...S.td, padding: "4px 3px", textAlign: "center" }}>
                        <div style={{ width: 20, height: 20, borderRadius: 4, background: s === "WEEKEND" ? "#161616" : `${AC[s]}22`, border: `1px solid ${s === "WEEKEND" ? "#1a1a1a" : `${AC[s]}44`}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto" }}>
                          {s !== "WEEKEND" && (
                            <span style={{ fontSize: 7, color: AC[s] }}>
                              {s === "PRESENT" ? "✓" : s === "ABSENT" ? "✗" : s === "LATE" ? "L" : "○"}
                            </span>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ display: "flex", gap: 16, padding: "12px 14px", borderTop: "1px solid #1a1a1a", flexWrap: "wrap" }}>
          {[
            ["Present", "#4ade80", "✓"],
            ["Absent", "#f87171", "✗"],
            ["Late", "#fbbf24", "L"],
            ["On Leave", "#c084fc", "○"],
          ].map(([l, c, s]) => (
            <div key={l} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#6b6660" }}>
              <div style={{ width: 16, height: 16, borderRadius: 3, background: `${c}22`, border: `1px solid ${c}44`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 7, color: c }}>{s}</span>
              </div>
              {l}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AttendancePage;