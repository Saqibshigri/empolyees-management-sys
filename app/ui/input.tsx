import { CSSProperties, ChangeEvent } from "react";
import { S } from "@/lib/styles";

export type InputProps = {
  label?: string;
  type?: string;
  value?: string | number;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean; // ✅ add this
  maxLength?: number;
  readOnly?: boolean;
  style?: CSSProperties;
};

const Input = ({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  disabled,
  maxLength,
  readOnly,
  style,
}: InputProps) => {
  return (
    <div>
      {label && <label style={S.label}>{label}</label>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={maxLength}
        readOnly={readOnly}
        style={{
          ...S.input,
          ...(disabled ? { opacity: 0.5, cursor: "not-allowed" } : {}),
          ...style,
        }}
      />
    </div>
  );
};

export default Input;