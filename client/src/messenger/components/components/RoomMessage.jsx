import { useState } from "react";
import useFile from "../../hooks/useFile";
import RoomMessageActions from "./RoomMessageActions";
import RoomMessageImages from "./RoomMessageImages";
import RoomMessageVideos from "./RoomMessageVideos";
import { actionsAnimationClasses } from "../../data/messengerConfiguration";
import "../../styles/RoomMessage.css";

export default function RoomMessage({ message }) {
  const { fileFromServer } = useFile();
  const [animation, setAnimation] = useState(null);

  const handleShowActions = () => {
    setAnimation(actionsAnimationClasses.show);
  };
  const handleHideActions = () => {
    setAnimation(actionsAnimationClasses.hide);
  };

  const toggleActionsVisibility = () => {
    setAnimation(
      animation === actionsAnimationClasses.show
        ? actionsAnimationClasses.hide
        : actionsAnimationClasses.show
    );
  };

  return (
    <div className="room-message-wrapper">
      <div
        className="room-message"
        onMouseOver={handleShowActions}
        onMouseOut={handleHideActions}
        onClick={toggleActionsVisibility}
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
      <RoomMessageActions message={message} animation={animation} />
    </div>
  );
}
