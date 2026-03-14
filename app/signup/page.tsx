// app/signup/page.tsx
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { S } from "@/lib/styles";
import { useToast } from "@/app/ui/toast";

const SignupPage = () => {
  const router = useRouter();
  const { addToast } = useToast();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async () => {
    setErr("");
    if (form.password !== form.confirmPassword) {
      setErr("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        addToast("success", "Account created! Please log in.");
        router.push("/login");
      } else {
        setErr(data.error || "Signup failed");
        addToast("error", data.error || "Signup failed");
      }
    } catch (error) {
      setErr("Network error");
      addToast("error", "Network error");
    } finally {
      setLoading(false);
    }
  };

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
      <div style={{ width: 440, position: "relative" }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
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
              marginBottom: 12,
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
            }}
          >
            Create Account
          </h1>
        </div>
        <div
          style={{
            background: "#111111",
            border: "1px solid #1e1e1e",
            borderRadius: 16,
            padding: 28,
          }}
        >
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            <div>
              <label style={S.label}>First Name</label>
              <input
                style={S.input}
                name='firstName'
                value={form.firstName}
                onChange={handleChange}
                placeholder='John'
              />
            </div>
            <div>
              <label style={S.label}>Last Name</label>
              <input
                style={S.input}
                name='lastName'
                value={form.lastName}
                onChange={handleChange}
                placeholder='Doe'
              />
            </div>
          </div>
          <div style={{ marginTop: 12 }}>
            <label style={S.label}>Email</label>
            <input
              style={S.input}
              name='email'
              type='email'
              value={form.email}
              onChange={handleChange}
              placeholder='you@example.com'
            />
          </div>
          <div style={{ marginTop: 12 }}>
            <label style={S.label}>Password</label>
            <input
              style={S.input}
              name='password'
              type='password'
              value={form.password}
              onChange={handleChange}
              placeholder='••••••••'
            />
          </div>
          <div style={{ marginTop: 12 }}>
            <label style={S.label}>Confirm Password</label>
            <input
              style={S.input}
              name='confirmPassword'
              type='password'
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder='••••••••'
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
                marginTop: 16,
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
              marginTop: 20,
            }}
            onClick={submit}
            disabled={loading}
          >
            {loading ? "Creating account…" : "Sign Up →"}
          </button>

          <div style={{ marginTop: 16, textAlign: "center" }}>
            <span style={{ color: "#4a4540", fontSize: 12 }}>
              Already have an account?{" "}
            </span>
            <button
              onClick={() => router.push("/login")}
              style={{
                background: "none",
                border: "none",
                color: "#d4a853",
                cursor: "pointer",
                fontSize: 12,
              }}
            >
              Sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
