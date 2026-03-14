// components/ui/Avatar.tsx
import React from "react";

interface AvatarProps {
  name: string;
  size?: number;
}

const Avatar: React.FC<AvatarProps> = ({ name, size = 32 }) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: "#2a2a2a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.4,
        fontWeight: 600,
        color: "#d4a853",
        border: "1px solid #3a3a3a",
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  );
};

export default Avatar;
