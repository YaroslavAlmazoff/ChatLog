import { useState } from "react";
import { CSSTransition } from "react-transition-group";
import useFile from "../../hooks/useFile";
import RoomMessageActions from "./RoomMessageActions";
import RoomMessageImages from "./RoomMessageImages";
import RoomMessageVideos from "./RoomMessageVideos";
import "../../styles/RoomMessage.css";

export default function RoomMessage({ message }) {
  const { fileFromServer } = useFile();
  const [showActions, setShowActions] = useState(false);

  return (
    <div
      className="room-message-wrapper"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      onClick={() => setShowActions((prev) => !prev)}
    >
      <div className="room-message">
        <div className="room-message-top">
          <img
            src={fileFromServer("useravatars", message.avatar)}
            alt="Avatar"
            className="room-message-avatar"
          />
          <span className="room-message-name">{message.name}</span>
        </div>
        <span className="room-message-text">{message.message}</span>
        <RoomMessageImages images={message.images} />
        <RoomMessageVideos videos={message.videos} />
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
