import React from "react";
import { S } from "../../lib/styles";

interface InputProps {
  label?: string;
  type?: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
  options?: { value: string; label: string }[];
  multiline?: boolean;
  rows?: number;
  placeholder?: string;
  maxLength?: number;
}

const Input: React.FC<InputProps> = ({
  label,
  type = "text",
  value,
  onChange,
  options,
  multiline,
  rows = 3,
  placeholder,
  maxLength,
}) => {
  return (
    <div style={{ marginBottom: 16 }}>
      {label && <label style={S.label}>{label}</label>}
      {options ? (
        <select style={S.input} value={value} onChange={onChange}>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : multiline ? (
        <textarea
          style={S.textarea}
          value={value}
          onChange={onChange}
          rows={rows}
          placeholder={placeholder}
          maxLength={maxLength}
        />
      ) : (
        <input
          type={type}
          style={S.input}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          maxLength={maxLength}
        />
      )}
    </div>
  );
};

export default Input;
