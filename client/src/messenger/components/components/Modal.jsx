import React from "react";
import "./Modal.css";

const Modal = ({ show, onClose, children }) => {
  if (!show) return null;

  return (
    <div className="room-modal" onClick={onClose}>
      <div className="room-modal-content" onClick={(e) => e.stopPropagation()}>
        <span className="room-modal-close" onClick={onClose}>
          &times;
        </span>
        <div className="room-modal-body">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
