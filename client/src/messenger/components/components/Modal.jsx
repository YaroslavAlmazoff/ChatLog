import React from "react";
import "../../styles/Modal.css";

const Modal = ({ show, onClose, children, type }) => {
  if (!show) return null;

  return (
    <div className="room-modal" onClick={onClose}>
      <div
        className={`room-modal-content room-modal-content-width room-modal-${type}`}
        onClick={(e) => e.stopPropagation()}
      >
        <span className="room-modal-close" onClick={onClose}>
          &times;
        </span>
        <div className="room-modal-body">{children}</div>
      </div>
    </div>
  );
};

export default Modal;