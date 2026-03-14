"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { S } from "@/lib/styles";
import Input from "@/app/ui/input";
import Select from "@/app/ui/select";
import Modal from "@/app/ui/modal";
import Avatar from "@/app/ui/avatar";
import Badge from "@/app/ui/badge";
import { useToast } from "@/app/ui/toast";
import { STATUS_CFG, ROLE_CFG } from "@/constants/page";

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  gender: string;
  city: string;
  country: string;
  salary: string | number;
  status: string;
  departmentId: string;
  designation: string;
  role: string;
  hireDate: string;
};

const EMPTY_EMP: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  phone: "",
  gender: "MALE",
  city: "",
  country: "",
  salary: "",
  status: "ACTIVE",
  departmentId: "",
  designation: "",
  role: "EMPLOYEE",
  hireDate: new Date().toISOString().split("T")[0],
};

const EmployeeForm = ({ emp, departments, onSave, onClose }: any) => {
  const [form, setForm] = useState<FormData>(
    emp ? { ...emp, password: "" } : EMPTY_EMP,
  );
  const [err, setErr] = useState("");

  const set = (k: keyof FormData, v: string) =>
    setForm((f: FormData) => ({ ...f, [k]: v }));

  const save = () => {
    if (
      !form.firstName ||
      !form.lastName ||
      !form.email ||
      (!emp && !form.password)
    ) {
      setErr("Fill required fields (*)");
      return;
    }
    onSave({ ...form, salary: Number(form.salary) || 0 });
  };

  return (
    <div style={{ padding: 24 }}>
      {err && (
        <div
          style={{
            background: "#2a1515",
            border: "1px solid #3a2020",
            borderRadius: 8,
            padding: "10px 12px",
            color: "#f87171",
            fontSize: 12,
            marginBottom: 16,
          }}
        >
          {err}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <Input
          label='First Name *'
          value={form.firstName}
          onChange={(e) => set("firstName", e.target.value)}
          placeholder='Alex'
        />
        <Input
          label='Last Name *'
          value={form.lastName}
          onChange={(e) => set("lastName", e.target.value)}
          placeholder='Morgan'
        />
        <Input
          label='Email *'
          type='email'
          value={form.email}
          onChange={(e) => set("email", e.target.value)}
          placeholder='alex@co.com'
          disabled={!!emp}
        />
        {!emp && (
          <Input
            label='Password *'
            type='password'
            value={form.password}
            onChange={(e) => set("password", e.target.value)}
            placeholder='••••••••'
          />
        )}
        <Input
          label='Phone'
          value={form.phone}
          onChange={(e) => set("phone", e.target.value)}
          placeholder='+1-555-0000'
        />
        <Input
          label='City'
          value={form.city}
          onChange={(e) => set("city", e.target.value)}
          placeholder='New York'
        />
        <Input
          label='Annual Salary ($)'
          type='number'
          value={form.salary as string}
          onChange={(e) => set("salary", e.target.value)}
          placeholder='75000'
        />
        <Input
          label='Hire Date'
          type='date'
          value={form.hireDate}
          onChange={(e) => set("hireDate", e.target.value)}
        />
        <Input
          label='Designation / Title'
          value={form.designation}
          onChange={(e) => set("designation", e.target.value)}
          placeholder='Senior Developer'
        />
        <Select
          label='Gender'
          value={form.gender}
          onChange={(e) => set("gender", e.target.value)}
          options={[
            { value: "MALE", label: "Male" },
            { value: "FEMALE", label: "Female" },
            { value: "OTHER", label: "Other" },
          ]}
        />
        <Select
          label='Department'
          value={form.departmentId}
          onChange={(e) => set("departmentId", e.target.value)}
          options={[
            { value: "", label: "-- None --" },
            ...departments.map((d: any) => ({ value: d.id, label: d.name })),
          ]}
        />
        <Select
          label='Role'
          value={form.role}
          onChange={(e) => set("role", e.target.value)}
          options={[
            { value: "EMPLOYEE", label: "Employee" },
            { value: "MANAGER", label: "Manager" },
            { value: "HR_MANAGER", label: "HR Manager" },
            { value: "ADMIN", label: "Admin" },
          ]}
        />
        <Select
          label='Status'
          value={form.status}
          onChange={(e) => set("status", e.target.value)}
          options={Object.entries(STATUS_CFG).map(([k, v]) => ({
            value: k,
            label: (v as any).label,
          }))}
        />
      </div>

      <div
        style={{
          display: "flex",
          gap: 10,
          marginTop: 20,
          justifyContent: "flex-end",
        }}
      >
        <button style={S.btnSecondary} onClick={onClose}>
          Cancel
        </button>
        <button style={S.btnPrimary} onClick={save}>
          {emp ? "Save Changes" : "Create Employee"}
        </button>
      </div>
    </div>
  );
};

const EmployeesPage = () => {
  const router = useRouter();
  const { addToast } = useToast();

  const [user, setUser] = useState<any>(null);
  const [employees, setEmployees] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [statusF, setStatusF] = useState("");
  const [deptF, setDeptF] = useState("");
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState<any>(null);
  const [viewEmp, setViewEmp] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const PER_PAGE = 8;

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
      const [empRes, deptRes] = await Promise.all([
        fetch("/api/employees"),
        fetch("/api/departments"),
      ]);
      setEmployees(await empRes.json());
      setDepartments(await deptRes.json());
    } catch (error) {
      addToast("error", "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const canEdit =
    user && ["SUPER_ADMIN", "ADMIN", "HR_MANAGER"].includes(user.role);
  const canDel = user && ["SUPER_ADMIN", "ADMIN"].includes(user.role);

  const filtered = employees.filter((e) => {
    const q = search.toLowerCase();
    const matchQ =
      !q ||
      `${e.firstName} ${e.lastName} ${e.email} ${e.employeeId}`
        .toLowerCase()
        .includes(q);
    const matchS = !statusF || e.status === statusF;
    const matchD = !deptF || e.departmentId === deptF;
    return matchQ && matchS && matchD;
  });

  const pages = Math.ceil(filtered.length / PER_PAGE);
  const shown = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const save = async (form: any) => {
    try {
      if (modal === "add") {
        const res = await fetch("/api/employees", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (res.ok) {
          const newEmp = await res.json();
          setEmployees((prev) => [...prev, newEmp]);
          addToast("success", "Employee created!");
        } else {
          addToast("error", "Failed to create");
        }
      } else {
        const res = await fetch(`/api/employees/${modal.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (res.ok) {
          const updated = await res.json();
          setEmployees((prev) =>
            prev.map((e) => (e.id === updated.id ? updated : e)),
          );
          addToast("success", "Employee updated!");
        } else {
          addToast("error", "Failed to update");
        }
      }
      setModal(null);
    } catch (error) {
      addToast("error", "Network error");
    }
  };

  const del = async (id: string, name: string) => {
    if (!confirm(`Delete ${name}?`)) return;
    try {
      const res = await fetch(`/api/employees/${id}`, { method: "DELETE" });
      if (res.ok) {
        setEmployees((prev) => prev.filter((e) => e.id !== id));
        addToast("success", "Employee deleted.");
      } else {
        addToast("error", "Failed to delete");
      }
    } catch (error) {
      addToast("error", "Network error");
    }
  };

  const dept = (id: string) => departments.find((d) => d.id === id);

  if (loading) return <div style={{ padding: 20 }}>Loading...</div>;

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
          <h1 style={S.h1}>Employees</h1>
          <p style={S.sub}>{filtered.length} records</p>
        </div>
        {canEdit && (
          <button style={S.btnPrimary} onClick={() => setModal("add")}>
            + Add Employee
          </button>
        )}
      </div>

      {/* Filters */}
      <div
        style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}
      >
        <div style={{ flex: 1, minWidth: 200, position: "relative" }}>
          <span
            style={{
              position: "absolute",
              left: 10,
              top: "50%",
              transform: "translateY(-50%)",
              color: "#4a4540",
              fontSize: 13,
            }}
          >
            ⌕
          </span>
          <input
            style={{ ...S.input, paddingLeft: 30 }}
            placeholder='Search by name, email, ID…'
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <select
          style={{ ...S.select, width: 150 }}
          value={statusF}
          onChange={(e) => {
            setStatusF(e.target.value);
            setPage(1);
          }}
        >
          <option value=''>All Status</option>
          {Object.entries(STATUS_CFG).map(([k, v]) => (
            <option key={k} value={k}>
              {(v as any).label}
            </option>
          ))}
        </select>
        <select
          style={{ ...S.select, width: 170 }}
          value={deptF}
          onChange={(e) => {
            setDeptF(e.target.value);
            setPage(1);
          }}
        >
          <option value=''>All Departments</option>
          {departments.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div style={S.card}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {[
                  "Employee",
                  "Department",
                  "Role",
                  "Status",
                  "Salary",
                  "Hire Date",
                  "",
                ].map((h) => (
                  <th key={h} style={S.th}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {shown.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    style={{
                      ...S.td,
                      textAlign: "center" as const,
                      padding: 40,
                      color: "#3a3530",
                    }}
                  >
                    No employees found
                  </td>
                </tr>
              )}
              {shown.map((e) => (
                <tr
                  key={e.id}
                  style={{ cursor: "pointer" }}
                  onClick={() => setViewEmp(e)}
                >
                  <td style={S.td}>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 10 }}
                    >
                      <Avatar name={`${e.firstName} ${e.lastName}`} />
                      <div>
                        <div
                          style={{
                            fontWeight: 600,
                            color: "#c8c0b0",
                            fontSize: 13,
                          }}
                        >
                          {e.firstName} {e.lastName}
                        </div>
                        <div style={{ fontSize: 11, color: "#4a4540" }}>
                          {e.employeeId} · {e.designation}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={S.td}>
                    {dept(e.departmentId)?.name || (
                      <span style={{ color: "#3a3530" }}>—</span>
                    )}
                  </td>
                  <td style={S.td}>
                    <Badge status={e.role} cfg={ROLE_CFG[e.role]} />
                  </td>
                  <td style={S.td}>
                    <Badge status={e.status} />
                  </td>
                  <td style={S.td}>${e.salary?.toLocaleString()}</td>
                  <td style={S.td}>
                    {new Date(e.hireDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  <td style={S.td} onClick={(ev) => ev.stopPropagation()}>
                    <div style={{ display: "flex", gap: 6 }}>
                      {canEdit && (
                        <button
                          style={S.btnIcon}
                          onClick={() => setModal(e)}
                          title='Edit'
                        >
                          ✎
                        </button>
                      )}
                      {canDel && (
                        <button
                          style={{
                            ...S.btnIcon,
                            color: "#f87171",
                            borderColor: "#2a2020",
                          }}
                          onClick={() =>
                            del(e.id, `${e.firstName} ${e.lastName}`)
                          }
                          title='Delete'
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {pages > 1 && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 14px",
              borderTop: "1px solid #1a1a1a",
            }}
          >
            <span style={{ fontSize: 12, color: "#4a4540" }}>
              Showing {(page - 1) * PER_PAGE + 1}–
              {Math.min(page * PER_PAGE, filtered.length)} of {filtered.length}
            </span>
            <div style={{ display: "flex", gap: 6 }}>
              <button
                style={S.btnSecondary}
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                ← Prev
              </button>
              <button
                style={S.btnSecondary}
                disabled={page >= pages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {modal && (
        <Modal
          title={
            modal === "add"
              ? "Add New Employee"
              : `Edit — ${modal.firstName} ${modal.lastName}`
          }
          onClose={() => setModal(null)}
          wide
        >
          <EmployeeForm
            emp={modal === "add" ? null : modal}
            departments={departments}
            onSave={save}
            onClose={() => setModal(null)}
          />
        </Modal>
      )}

      {/* View Modal */}
      {viewEmp && (
        <Modal title='Employee Details' onClose={() => setViewEmp(null)}>
          <div style={{ padding: 24 }}>
            <div
              style={{
                display: "flex",
                gap: 16,
                marginBottom: 20,
                alignItems: "flex-start",
              }}
            >
              <Avatar
                name={`${viewEmp.firstName} ${viewEmp.lastName}`}
                size={52}
              />
              <div>
                <div
                  style={{ fontSize: 17, fontWeight: 700, color: "#e8e0d0" }}
                >
                  {viewEmp.firstName} {viewEmp.lastName}
                </div>
                <div
                  style={{ fontSize: 13, color: "#6b6660", marginBottom: 8 }}
                >
                  {viewEmp.designation} · {dept(viewEmp.departmentId)?.name}
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <Badge status={viewEmp.status} />
                  <Badge status={viewEmp.role} cfg={ROLE_CFG[viewEmp.role]} />
                </div>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 0,
              }}
            >
              {[
                ["Employee ID", viewEmp.employeeId],
                ["Email", viewEmp.email],
                ["Phone", viewEmp.phone || "—"],
                ["Gender", viewEmp.gender],
                ["City", viewEmp.city || "—"],
                ["Hire Date", new Date(viewEmp.hireDate).toLocaleDateString()],
                ["Annual Salary", `$${viewEmp.salary?.toLocaleString()}`],
                ["Status", viewEmp.status],
              ].map(([l, v]) => (
                <div
                  key={l}
                  style={{
                    padding: "10px 0",
                    borderBottom: "1px solid #1a1a1a",
                    paddingRight: 16,
                  }}
                >
                  <div
                    style={{
                      fontSize: 10,
                      color: "#4a4540",
                      textTransform: "uppercase" as const,
                      letterSpacing: "0.1em",
                      marginBottom: 2,
                    }}
                  >
                    {l}
                  </div>
                  <div
                    style={{ fontSize: 13, color: "#c8c0b0", fontWeight: 500 }}
                  >
                    {v}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default EmployeesPage;