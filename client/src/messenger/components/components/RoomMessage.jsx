import useFile from "../../hooks/useFile";
import RoomMessageActions from "./RoomMessageActions";
import RoomMessageImages from "./RoomMessageImages";
import RoomMessageVideos from "./RoomMessageVideos";
import "../../styles/RoomMessage.css";
import { useState } from "react";

export default function RoomMessage({ message }) {
  const { fileFromServer } = useFile();
  const [showActions, setShowActions] = useState(false);

  return (
    <div className="room-message-wrapper">
      <div
        className="room-message"
        onMouseOver={() => setShowActions(true)}
        onMouseOut={() => setShowActions(false)}
      >
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
      {showActions && <RoomMessageActions message={message} />}
    </div>
  );
}
