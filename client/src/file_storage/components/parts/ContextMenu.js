import React from "react";

const ContextMenu = ({ x, y, onClose, children }) => {
  return (
    <ul className="context-menu block" style={{ left: x, top: y }}>
      {children}
    </ul>
  );
};

export default ContextMenu;
