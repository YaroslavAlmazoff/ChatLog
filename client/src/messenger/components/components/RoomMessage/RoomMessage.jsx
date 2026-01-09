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

export default function RoomMessage({ message }) {
  const { fileFromServer } = useFile();
  const [showActions, setShowActions] = useState(false);
  const { makeMessageOld, load } = useContext(ImageLoadContext);

  const [loadedImages, setLoadedImages] = useState(0);
  const [loadedVideos, setLoadedVideos] = useState(0);

  const [allImagesLoaded, setAllImagesLoaded] = useState(false);
  const [allVideosLoaded, setAllVideosLoaded] = useState(false);

  useEffect(() => {
    if (message.isNew) {
      load();
      if (!message.images.length && !message.videos.length) {
        makeMessageOld(message);
      } else if (!message.images.length) {
        setAllImagesLoaded(true);
      } else if (!message.videos.length) {
        setAllVideosLoaded(true);
      }
    }
  }, [message]);

  const onImageLoaded = () => {
    setLoadedImages((prev) => prev + 1);
    if (loadedImages + 1 === message.images.length) {
      setAllImagesLoaded(true);
    }
  };

  const onVideoLoaded = () => {
    setLoadedVideos((prev) => prev + 1);
    if (loadedVideos + 1 === message.videos.length) {
      setAllVideosLoaded(true);
    }
  };

  useEffect(() => {
    if (allImagesLoaded && allVideosLoaded) {
      makeMessageOld(message);
    }
  }, [allImagesLoaded, allVideosLoaded]);

  return (
    <MessageContext.Provider value={{ message }}>
      <div
        className="room-message-wrapper"
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
      >
        <div
          className="room-message room-message-width"
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
          <RoomMessageImages
            images={message.images}
            onImageLoaded={onImageLoaded}
          />
          <RoomMessageVideos
            videos={message.videos}
            onVideoLoaded={onVideoLoaded}
          />
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
