import { useState } from "react";
import { CSSTransition } from "react-transition-group";
import useFile from "../../../hooks/useFile";
import RoomMessageActions from "./RoomMessageActions";
import RoomMessageImages from "./RoomMessageImages";
import RoomMessageVideos from "./RoomMessageVideos";
import "../../../styles/RoomMessage.css";
import "../../../styles/RoomMessageMedia.css";

export default function RoomMessage({ message }) {
  const { fileFromServer } = useFile();
  const [showActions, setShowActions] = useState(false);

  return (
    <div
      className="room-message-wrapper"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div
        className="room-message"
        onMouseEnter={() => setShowActions(true)}
        onClick={() => setShowActions((prev) => !prev)}
      >
        <div className="room-message-top">
          <img
            src={fileFromServer("useravatars", message.avatarUrl)}
            alt="Avatar"
            className="room-message-avatar"
          />
          <span className="room-message-name">{message.name}</span>
        </div>
        <span className="room-message-text">{message.message}</span>
        <RoomMessageImages images={message.images} isNew={isNew} />
        <RoomMessageVideos videos={message.videos} isNew={isNew} />
      </div>
      <CSSTransition
        in={showActions}
        timeout={100}
        classNames="fade"
        unmountOnExit
      >
        <RoomMessageActions message={message} />
      </CSSTransition>
    </div>
  );
}
