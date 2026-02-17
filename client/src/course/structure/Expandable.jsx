function Expandable({
  title,
  children,
  level = 0,
  isOpen,
  onToggle,
  rightContent,
  onTitleClick,
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
          className="course-structure-arrow"
          onClick={(e) => {
            e.stopPropagation();
            onToggle?.();
          }}
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
          onClick={(e) => {
            e.stopPropagation();
            onToggle?.();
          }}
          style={{ flex: 1, cursor: "pointer" }}
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
