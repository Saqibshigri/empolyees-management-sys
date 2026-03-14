// app/departments/page.tsx
"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Modal from "@/app/ui/modal";
import Input from "@/app/ui/input";
import { S } from "@/lib/styles";
import { useToast } from "@/app/context/toastContext";

const DepartmentsPage = () => {
  const router = useRouter();
  const { addToast } = useToast();
  const [user, setUser] = useState<boolean>( false);
  const [departments, setDepartments] = useState<boolean[]>([]);
  const [employees, setEmployees] = useState<boolean[]>([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({
    name: "",
    code: "",
    description: "",
    budget: "",
  });

//   useEffect(() => {
//     const stored = localStorage.getItem("user");
//     if (!stored) {
//       router.push("/login");
//       return;
//     }
//     setUser(JSON.parse(stored));
//     fetchData();
//   }, []);

  const fetchData = async () => {
    try {
      const [deptRes, empRes] = await Promise.all([
        fetch("/api/departments"),
        fetch("/api/employees"),
      ]);
      setDepartments(await deptRes.json());
      setEmployees(await empRes.json());
    } catch (error) {
      addToast("Failed to load data", "error");
    }
  };

  const canManage =
    user && ["SUPER_ADMIN", "ADMIN", "HR_MANAGER"].includes(user.role);

  const save = async () => {
    if (!form.name || !form.code) return;
    try {
      const res = await fetch("/api/departments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, budget: Number(form.budget) || 0 }),
      });
      if (res.ok) {
        const newDept = await res.json();
        setDepartments((prev) => [...prev, newDept]);
        addToast("Department created!", "success");
        setModal(false);
        setForm({ name: "", code: "", description: "", budget: "" });
      } else {
        addToast("Failed to create", "error");
      }
    } catch (error) {
      addToast("Network error", "error");
    }
  };

  const ACCENT = [
    "#d4a853",
    "#60a5fa",
    "#4ade80",
    "#fb923c",
    "#c084fc",
    "#22d3ee",
  ];

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 22,
        }}
      >
        <div>
          <h1 style={S.h1}>Departments</h1>
          <p style={S.sub}>{departments.length} departments</p>
        </div>
        {canManage && (
          <button style={S.btnPrimary} onClick={() => setModal(true)}>
            + New Department
          </button>
        )}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))",
          gap: 14,
        }}
      >
        {departments.map((d, i) => {
          const emps = employees.filter((e) => e.departmentId === d.id);
          const active = emps.filter((e) => e.status === "ACTIVE").length;
          const acc = ACCENT[i % ACCENT.length];
          return (
            <div
              key={d.id}
              style={{
                ...S.card,
                borderTop: `2px solid ${acc}20`,
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: 80,
                  height: 80,
                  background: `radial-gradient(circle, ${acc}10, transparent)`,
                  pointerEvents: "none",
                }}
              />
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  marginBottom: 14,
                }}
              >
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 10,
                    background: `${acc}18`,
                    border: `1px solid ${acc}30`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 16,
                    color: acc,
                  }}
                >
                  ⬡
                </div>
                <span
                  style={{
                    fontFamily: "monospace",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#4a4540",
                    background: "#1a1a1a",
                    padding: "3px 8px",
                    borderRadius: 6,
                    border: "1px solid #252525",
                  }}
                >
                  {d.code}
                </span>
              </div>
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: "#e8e0d0",
                  marginBottom: 4,
                }}
              >
                {d.name}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: "#6b6660",
                  marginBottom: 18,
                  minHeight: 32,
                }}
              >
                {d.description || "No description"}
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 8,
                }}
              >
                <div
                  style={{
                    background: "#1a1a1a",
                    borderRadius: 8,
                    padding: "10px 12px",
                  }}
                >
                  <div
                    style={{
                      fontSize: 10,
                      color: "#4a4540",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      marginBottom: 2,
                    }}
                  >
                    Total
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: acc }}>
                    {emps.length}
                  </div>
                </div>
                <div
                  style={{
                    background: "#1a1a1a",
                    borderRadius: 8,
                    padding: "10px 12px",
                  }}
                >
                  <div
                    style={{
                      fontSize: 10,
                      color: "#4a4540",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      marginBottom: 2,
                    }}
                  >
                    Active
                  </div>
                  <div
                    style={{ fontSize: 20, fontWeight: 800, color: "#4ade80" }}
                  >
                    {active}
                  </div>
                </div>
              </div>
              {d.budget > 0 && (
                <div style={{ marginTop: 10, fontSize: 12, color: "#6b6660" }}>
                  Budget:{" "}
                  <span style={{ color: "#c8c0b0", fontWeight: 600 }}>
                    ${(d.budget / 1000).toFixed(0)}K
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {modal && (
        <Modal title='New Department' onClose={() => setModal(false)}>
          <div style={{ padding: 24 }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 14,
                marginBottom: 14,
              }}
            >
              <Input
                label='Department Name *'
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                placeholder='Engineering'
              />
              <Input
                label='Code * (e.g. ENG)'
                value={form.code}
                onChange={(e) =>
                  setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))
                }
                placeholder='ENG'
                maxLength={6}
              />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={S.label}>Description</label>
              <textarea
                style={{ ...S.input, height: 72, resize: "vertical" }}
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                placeholder='What does this department do?'
              />
            </div>
            <Input
              label='Annual Budget ($)'
              type='number'
              value={form.budget}
              onChange={(e) =>
                setForm((f) => ({ ...f, budget: e.target.value }))
              }
              placeholder='500000'
            />
            <div
              style={{
                display: "flex",
                gap: 10,
                justifyContent: "flex-end",
                marginTop: 20,
              }}
            >
              <button style={S.btnSecondary} onClick={() => setModal(false)}>
                Cancel
              </button>
              <button style={S.btnPrimary} onClick={save}>
                Create Department
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default DepartmentsPage;
