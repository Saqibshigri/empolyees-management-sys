// components/ui/Modal.tsx
"use client";
import React from "react";
import { S } from "@/lib/styles";

interface ModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  wide?: boolean;
}

const Modal: React.FC<ModalProps> = ({ title, onClose, children, wide }) => (
  <div
    style={S.overlay}
    onClick={(e) => e.target === e.currentTarget && onClose()}
  >
    <div style={{ ...S.modal, maxWidth: wide ? 700 : 540 }}>
      <div
        style={{
          padding: "20px 24px 16px",
          borderBottom: "1px solid #1e1e1e",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}
      >
        <h2 style={{ ...S.h2, fontSize: 15 }}>{title}</h2>
        <button
          onClick={onClose}
          style={{
            ...S.btnIcon,
            border: "none",
            fontSize: 18,
            color: "#4a4540",
          }}
        >
          ✕
        </button>
      </div>
      <div style={{ overflowY: "auto", flex: 1 }}>{children}</div>
    </div>
  </div>
);

export default Modal;
