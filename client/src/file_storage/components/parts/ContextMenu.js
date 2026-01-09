import React from "react";
import "../../styles/context-menu.css";

const ContextMenu = ({ x, y, onClose, children }) => {
  return (
    <ul className="context-menu block" style={{ left: x, top: y }}>
      {children}
    </ul>
  );
};

export default ContextMenu;
