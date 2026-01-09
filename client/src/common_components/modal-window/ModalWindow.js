import React from "react";
import "./modal-window.css";

const ModalWindow = ({ onClose, onConfirm, text, type }) => {
  return (
    <div className="modal-window-container block">
      <div className="modal-window-content">
        <p className="modal-window-text">{text}</p>
        <button
          className={`modal-window-button ${
            type && type === "delete" ? "button-neon-red" : "button"
          }`}
          onClick={(e) => {
            e.stopPropagation();
            onConfirm();
          }}
        >
          {type && type === "delete" ? "Подтвердить" : "ОК"}
        </button>
        {type && type === "delete" && (
          <span
            className="modal-window-cancel"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          >
            Отмена
          </span>
        )}
      </div>
    </div>
  );
};

export default ModalWindow;
