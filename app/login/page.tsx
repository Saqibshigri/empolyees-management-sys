// app/login/page.tsx
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { S } from "@/lib/styles";
import { useToast } from "@/app/ui/toast";

const LoginPage = () => {
  const router = useRouter();
  const { addToast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const QUICK = [
    {
      label: "Super Admin",
      email: "admin@ems.com",
      password: "admin123",
      role: "SUPER_ADMIN",
    },
    {
      label: "HR Manager",
      email: "hr@ems.com",
      password: "hr123",
      role: "HR_MANAGER",
    },
    {
      label: "Manager",
      email: "manager@ems.com",
      password: "mgr123",
      role: "MANAGER",
    },
    {
      label: "Employee",
      email: "emp@ems.com",
      password: "emp123",
      role: "EMPLOYEE",
    },
  ];

  const submit = async () => {
    setLoading(true);
    setErr("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("user", JSON.stringify(data.user));
        addToast("Logged in successfully", "success");
        router.push("/dashboard");
      } else {
        setErr(data.error || "Invalid credentials");
        addToast(data.error || "Login failed", "error");
      }
    } catch (error) {
      setErr("Network error");
      addToast("Network error", "error");
    } finally {
      setLoading(false);
    }
  };

  // ... rest of the JSX same as before (with styles), just replace onLogin with router
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* same grid background, logo, form */}
      <div style={{ width: 420, position: "relative" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div
            style={{
              width: 56,
              height: 56,
              background: "linear-gradient(135deg,#d4a853,#a07830)",
              borderRadius: 14,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              fontWeight: 900,
              color: "#0d0d0d",
              marginBottom: 16,
              boxShadow: "0 0 40px rgba(212,168,83,0.25)",
            }}
          >
            E
          </div>
          <h1
            style={{
              color: "#e8e0d0",
              fontSize: 26,
              fontWeight: 800,
              margin: 0,
              letterSpacing: "-0.03em",
            }}
          >
            EMS Portal
          </h1>
          <p style={{ color: "#4a4540", fontSize: 13, margin: "6px 0 0" }}>
            Employee Management System
          </p>
        </div>

        <div
          style={{
            background: "#111111",
            border: "1px solid #1e1e1e",
            borderRadius: 16,
            padding: 28,
          }}
        >
          <div style={{ marginBottom: 16 }}>
            <label style={S.label}>Email Address</label>
            <input
              style={S.input}
              type='email'
              value={email}
              placeholder='you@company.com'
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
            />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={S.label}>Password</label>
            <input
              style={S.input}
              type='password'
              value={password}
              placeholder='••••••••'
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
            />
          </div>
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
          <button
            style={{
              ...S.btnPrimary,
              width: "100%",
              justifyContent: "center",
              padding: "11px",
              fontSize: 14,
            }}
            onClick={submit}
            disabled={loading}
          >
            {loading ? "Signing in…" : "Sign In →"}
          </button>

          <div style={{ marginTop: 16, textAlign: "center" }}>
            <span style={{ color: "#4a4540", fontSize: 12 }}>
              Don't have an account?{" "}
            </span>
            <button
              onClick={() => router.push("/signup")}
              style={{
                background: "none",
                border: "none",
                color: "#d4a853",
                cursor: "pointer",
                fontSize: 12,
              }}
            >
              Sign up
            </button>
          </div>

          <div
            style={{
              borderTop: "1px solid #1a1a1a",
              marginTop: 24,
              paddingTop: 20,
            }}
          >
            <p
              style={{
                fontSize: 11,
                color: "#4a4540",
                textAlign: "center",
                marginBottom: 12,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              Quick demo access
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 8,
              }}
            >
              {QUICK.map((q) => (
                <button
                  key={q.label}
                  style={{
                    ...S.btnSecondary,
                    justifyContent: "flex-start",
                    fontSize: 12,
                    padding: "8px 12px",
                  }}
                  onClick={() => {
                    setEmail(q.email);
                    setPassword(q.password);
                  }}
                >
                  <span style={{ fontSize: 14 }}>
                    {q.role === "SUPER_ADMIN"
                      ? "⚡"
                      : q.role === "HR_MANAGER"
                        ? "👥"
                        : q.role === "MANAGER"
                          ? "🏢"
                          : "👤"}
                  </span>
                  {q.label}
                </button>
              ))}
            </div>
            <p
              style={{
                fontSize: 11,
                color: "#3a3530",
                textAlign: "center",
                marginTop: 10,
              }}
            >
              Click a role then Sign In, or type credentials above
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
