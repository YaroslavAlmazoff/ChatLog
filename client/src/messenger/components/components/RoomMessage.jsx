import { useState } from "react";
import useFile from "../../hooks/useFile";
import RoomMessageActions from "./RoomMessageActions";
import RoomMessageImages from "./RoomMessageImages";
import RoomMessageVideos from "./RoomMessageVideos";
import { actionsAnimationClasses } from "../../data/messengerConfiguration";
import "../../styles/RoomMessage.css";

export default function RoomMessage({ message }) {
  const { fileFromServer } = useFile();
  const [actionsVisibility, setActionsVisibility] = useState(false);
  const [animation, setAnimation] = useState(null);

  const showActions = () => {
    setActionsVisibility(true);
    setAnimation(actionsAnimationClasses.show);
  };
  const hideActions = () => {
    setAnimation(actionsAnimationClasses.hide);
    setTimeout(() => {
      setActionsVisibility(false);
    }, 500);
  };

  const toggleActionsVisibility = () => {
    if (animation === actionsAnimationClasses.show) {
      showActions();
    } else {
      hideActions();
    }
  };

  return (
    <div className="room-message-wrapper">
      <div
        className="room-message"
        onMouseOver={showActions}
        onMouseOut={hideActions}
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
      {actionsVisibility && (
        <RoomMessageActions message={message} animation={animation} />
      )}
    </div>
  );
}
