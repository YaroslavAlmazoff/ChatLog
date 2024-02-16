import React from "react";
import "./modal-window.css";

const ModalWindow = ({ isOpen, onClose, onConfirm, text }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <p>{text}</p>
        <button onClick={onConfirm}>Подтвердить</button>
        <button onClick={onClose}>Отмена</button>
      </div>
    </div>
  );
};

export default ModalWindow;
