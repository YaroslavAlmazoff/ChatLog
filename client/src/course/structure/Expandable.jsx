import { useState } from "react";

function Expandable({
  title,
  children,
  level = 0,
  rightContent,
  onTitleClick,
  isOpen,
  onToggle,
}) {
  return (
    <div style={{ marginLeft: level * 16 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          fontWeight: "bold",
          userSelect: "none",
        }}
      >
        <span
          onClick={onToggle}
          style={{
            marginRight: 8,
            cursor: "pointer",
            transition: "transform 0.2s",
            transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
          }}
        >
          ▶
        </span>

        <span
          onClick={onTitleClick}
          style={{ flex: 1, cursor: onTitleClick ? "pointer" : "default" }}
        >
          {title}
        </span>

        {rightContent}
      </div>

      {isOpen && <div style={{ paddingTop: 8 }}>{children}</div>}
    </div>
  );
}

export default Expandable;
