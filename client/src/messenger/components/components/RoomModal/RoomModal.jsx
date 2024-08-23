import React, { useRef } from "react";
import "../../styles/Modal.css";
import { modalTypes } from "../../../data/messengerConfiguration";
import RoomModalImage from "./RoomModalImage";
import RoomModalVideo from "./RoomModalVideo";

const RoomModal = ({
  show = false,
  onClose = () => {},
  children = <div></div>,
  type = modalTypes.neutral,
  url = "",
}) => {
  const modalRef = useRef(null);

  if (!show) return null;

  const isSuccess = type === modalTypes.success;
  const isNeutral = type === modalTypes.neutral;
  const isError = type === modalTypes.error;
  const isImage = type === modalTypes.image;
  const isVideo = type === modalTypes.video;

  return (
    <div className="room-modal" onClick={onClose} ref={modalRef}>
      <span className="room-modal-close" onClick={onClose}>
        &times;
      </span>
      {isSuccess || isNeutral || isError ? (
        <div
          className={`room-modal-content room-modal-content-width room-modal-${type}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="room-modal-body">{children}</div>
        </div>
      ) : (
        <div className="room-modal-media">
          <RoomModalImage isImage={isImage} url={url} />
          <RoomModalVideo isVideo={isVideo} url={url} />
        </div>
      )}
    </div>
  );
};

export default RoomModal;
