import React from "react";
import "./modal-window.css";

const ModalWindow = ({ isOpen, onClose, onConfirm, text }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-window">
      <div className="modal-window-content">
        <p>{text}</p>
        <button className="modal-window-button" onClick={onConfirm}>
          Подтвердить
        </button>
        <button className="modal-window-button" onClick={onClose}>
          Отмена
        </button>
      </div>
    </div>
  );
};

export default ModalWindow;
