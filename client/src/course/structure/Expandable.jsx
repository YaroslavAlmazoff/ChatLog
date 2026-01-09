import { useState } from "react";

function Expandable({ title, children, level = 0, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div style={{ marginLeft: level * 16 }}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          fontWeight: "bold",
          userSelect: "none",
        }}
      >
        <span
          style={{
            marginRight: 8,
            transition: "transform 0.2s",
            transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
          }}
        >
          ▶
        </span>
        {title}
      </div>

      <div className={`expandable-content ${isOpen ? "open" : "closed"}`}>
        <div style={{ paddingTop: 8 }}>{children}</div>
      </div>
    </div>
  );
}
export default Expandable;
