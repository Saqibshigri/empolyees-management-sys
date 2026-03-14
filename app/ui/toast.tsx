 // components/ui/Toast.tsx
"use client";
import React, { createContext, useContext, useState, useCallback } from "react";

interface Toast {
  id: string;
  type: "success" | "error";
  msg: string;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (type: "success" | "error", msg: string) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((type: "success" | "error", msg: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, msg }]);
    // Auto remove after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

const Toast = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          style={{
            background: t.type === "error" ? "#2a1515" : "#141e14",
            border: `1px solid ${t.type === "error" ? "#3a2020" : "#1a2a1a"}`,
            borderRadius: 10,
            padding: "12px 18px",
            fontSize: 13,
            color: t.type === "error" ? "#f87171" : "#4ade80",
            display: "flex",
            alignItems: "center",
            gap: 10,
            animation: "slideIn 0.25s ease",
            boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
            cursor: "pointer",
          }}
          onClick={() => removeToast(t.id)}
        >
          <span>{t.type === "error" ? "⚠" : "✓"}</span> {t.msg}
          <style>{`@keyframes slideIn { from { transform: translateX(60px); opacity:0 } }`}</style>
        </div>
      ))}
    </div>
  );
};

export default Toast;