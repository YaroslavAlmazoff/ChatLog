import React from "react";

const ContextMenu = ({ x, y, onClose, children }) => {
  return (
    <ul className="context-menu" style={{ left: x, top: y }}>
      {children}
    </ul>
  );
};

export default ContextMenu;
