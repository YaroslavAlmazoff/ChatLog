import React from "react";
import "./modal-window.css";

const ModalWindow = ({ isOpen, onClose, onConfirm, text }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-window-container block">
      <div className="modal-window-content">
        <p className="modal-window-text">{text}</p>
        <button
          className="modal-window-button button-neon-red"
          onClick={onConfirm}
        >
          Подтвердить
        </button>
        <span className="modal-window-button" onClick={onClose}>
          Отмена
        </span>
      </div>
    </div>
  );
};

export default ModalWindow;
