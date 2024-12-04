import { useContext, useEffect, useState } from "react";
import { CSSTransition } from "react-transition-group";
import useFile from "../../../hooks/useFile";
import RoomMessageActions from "./RoomMessageActions";
import RoomMessageImages from "./RoomMessageImages";
import RoomMessageVideos from "./RoomMessageVideos";
import { ImageLoadContext } from "../../../context/ImageLoadContext";
import { MessageContext } from "../../../context/MessageContext";
import "../../../styles/RoomMessage.css";
import "../../../styles/RoomMessageMedia.css";

export default function RoomMessage({ message, index }) {
  const { fileFromServer } = useFile();
  const [showActions, setShowActions] = useState(false);
  const { register, load } = useContext(ImageLoadContext);

  useEffect(() => {
    if (message.isNew) {
      //register();
      //console.log("registered " + message.message);
      // setTimeout(() => {
      load();
      console.log("loaded " + message.message);
      // }, 50);
    }
  }, []);

  return (
    <MessageContext.Provider value={{ message }}>
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
    </MessageContext.Provider>
  );
}
