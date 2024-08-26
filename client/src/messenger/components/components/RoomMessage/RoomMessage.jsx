import { useContext, useState } from "react";
import { CSSTransition } from "react-transition-group";
import useFile from "../../../hooks/useFile";
import RoomMessageActions from "./RoomMessageActions";
import RoomMessageImages from "./RoomMessageImages";
import RoomMessageVideos from "./RoomMessageVideos";
import "../../../styles/RoomMessage.css";
import "../../../styles/RoomMessageMedia.css";
import { ImageLoadContext } from "../../../context/ImageLoadContext";

export default function RoomMessage({ message, index }) {
  const { fileFromServer } = useFile();
  const [showActions, setShowActions] = useState(false);

  const { loadMedia } = useContext(ImageLoadContext);

  if (message.isNew && index % 10 === 0) {
    loadMedia(0);
  }

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
        <RoomMessageImages images={message.images} isNew={message.isNew} />
        <RoomMessageVideos videos={message.videos} isNew={message.isNew} />
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
