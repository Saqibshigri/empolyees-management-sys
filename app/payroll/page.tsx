 // app/payroll/page.tsx
"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Stat from "@/app/ui/stat";
import Avatar from "@/app/ui/avatar";
import { S } from "@/lib/styles";
import { MONTHS } from "@/constants/page";
import { useToast } from "@/app/ui/toast";

const PayrollPage = () => {
  const router = useRouter();
  const { addToast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [employees, setEmployees] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [payrolls, setPayrolls] = useState<any[]>([]);
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
      addToast("Failed to load data", "error");
    } finally {
      setLoading(false);
    }
  };

  const canManage = user && ["SUPER_ADMIN", "ADMIN"].includes(user.role);

  const current = payrolls.filter((p: any) => p.month === month && p.year === year);
  const enriched = current
    .map((p: any) => ({
      ...p,
      employee: employees.find((e: any) => e.id === p.employeeId),
    }))
    .filter((p: any) => p.employee);

  const totals = enriched.reduce(
    (a: any, p: any) => ({
      net: a.net + p.netSalary,
      basic: a.basic + p.basicSalary,
      tax: a.tax + p.tax,
    }),
    { net: 0, basic: 0, tax: 0 },
  );

  const generate = async () => {
    try {
      const res = await fetch("/api/payroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ month, year }),
      });
      if (res.ok) {
        const newPayrolls = await res.json();
        setPayrolls((prev) => [...prev, ...newPayrolls]);
        addToast(`Generated ${newPayrolls.length} payroll records`, "success");
      } else {
        addToast("Failed to generate", "error");
      }
    } catch (error) {
      addToast("Network error", "error");
    }
  };

  const markPaid = async (id: string) => {
    try {
      const res = await fetch(`/api/payroll/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "PAID" }),
      });
      if (res.ok) {
        setPayrolls((prev: any[]) =>
          prev.map((p: any) => (p.id === id ? { ...p, status: "PAID" } : p))
        );
        addToast("Marked as paid!", "success");
      } else {
        addToast("Failed to update", "error");
      }
    } catch (error) {
      addToast("Network error", "error");
    }
  };

  const PC = {
    PAID: "#4ade80",
    PROCESSED: "#60a5fa",
    DRAFT: "#6b6660",
    CANCELLED: "#f87171",
  };

  if (loading) return <div style={{ padding: 20 }}>Loading...</div>;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={S.h1}>Payroll</h1>
          <p style={S.sub}>{MONTHS[month - 1]} {year}</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <select style={{ ...S.select, width: 100 }} value={month} onChange={(e) => setMonth(Number(e.target.value))}>
            {MONTHS.map((m, i) => <option key={m} value={i+1}>{m}</option>)}
          </select>
          <select style={{ ...S.select, width: 90 }} value={year} onChange={(e) => setYear(Number(e.target.value))}>
            {[2024, 2025].map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
          {canManage && (
            <button style={S.btnPrimary} onClick={generate}>⟳ Generate</button>
          )}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 20 }}>
        <Stat label="Net Payout" value={`$${(totals.net / 1000).toFixed(1)}K`} icon="◈" color="#d4a853" />
        <Stat label="Total Basic" value={`$${(totals.basic / 1000).toFixed(1)}K`} icon="✦" color="#60a5fa" />
        <Stat label="Total Tax" value={`$${(totals.tax / 1000).toFixed(1)}K`} icon="⊖" color="#f87171" />
      </div>

      <div style={S.card}>
        {enriched.length === 0 ? (
          <div style={{ textAlign: "center", padding: "50px 0", color: "#3a3530" }}>
            No payroll for {MONTHS[month - 1]} {year}.{canManage && " Click Generate to create."}
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {["Employee", "Dept", "Basic", "Bonus", "Tax", "Deductions", "Net", "Status", ""].map((h) => (
                    <th key={h} style={S.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {enriched.map((p: any) => (
                  <tr key={p.id}>
                    <td style={S.td}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <Avatar name={`${p.employee.firstName} ${p.employee.lastName}`} size={28} />
                        <div>
                          <div style={{ fontWeight: 600, color: "#c8c0b0", fontSize: 13 }}>{p.employee.firstName} {p.employee.lastName}</div>
                          <div style={{ fontSize: 11, color: "#4a4540" }}>{p.employee.employeeId}</div>
                        </div>
                      </div>
                    </td>
                    <td style={S.td}>{departments.find((d: any) => d.id === p.employee.departmentId)?.code || "—"}</td>
                    <td style={S.td}>${p.basicSalary.toLocaleString()}</td>
                    <td style={{ ...S.td, color: "#4ade80" }}>+${p.bonus.toLocaleString()}</td>
                    <td style={{ ...S.td, color: "#f87171" }}>−${p.tax.toLocaleString()}</td>
                    <td style={{ ...S.td, color: "#fb923c" }}>−${p.deductions.toLocaleString()}</td>
                    <td style={{ ...S.td, color: "#d4a853", fontWeight: 700 }}>${p.netSalary.toLocaleString()}</td>
                    <td style={S.td}>
                      <span style={{ background: `${PC[p.status as keyof typeof PC]}22`, color: PC[p.status as keyof typeof PC], padding: "2px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600 }}>
                        {p.status}
                      </span>
                    </td>
                    <td style={S.td}>
                      {canManage && p.status !== "PAID" && (
                        <button style={{ ...S.btnIcon, color: "#4ade80", borderColor: "#1a3020" }} onClick={() => markPaid(p.id)} title="Mark Paid">✓</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PayrollPage;