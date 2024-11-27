import useFile from "../../../hooks/useFile";
import useWindow from "../../../hooks/useWindow";
import useList from "../../../hooks/useList";
import useImage from "../../../hooks/useImage";
import { useState, useEffect, useContext, useRef } from "react";
import { folders } from "../../../data/messengerConfiguration";
import { ImageLoadContext } from "../../../context/ImageLoadContext";
import { MessageContext } from "../../../context/MessageContext";

export default function RoomMessageVideo({ video, index, count }) {
  const { getIsLast, getIsSingle } = useList();

  const { fileFromServer } = useFile();
  const { openInNewTab } = useWindow();
  const { determineImageFormat } = useImage();

  const { registerMedia, loadMedia, setJustSentMediaLoaded, firstLoad } =
    useContext(ImageLoadContext);
  const { message } = useContext(MessageContext);
  const videoRef = useRef(null);

  const isLast = getIsLast(index, count);
  const isSingle = getIsSingle(count);

  useEffect(() => {
    if (firstLoad ? message.isNew : !message.isNew) {
      registerMedia();
    }
  }, [registerMedia]);

  const onVideoLoad = (e) => {
    if (isSingle) {
      videoRef.current.classList.add(
        `room-message-single-video-${determineImageFormat(videoRef.current)}`
      );
    }
    if (firstLoad ? message.isNew : !message.isNew) {
      loadMedia(videoRef.current.offsetHeight);
    }
    if (message.isJustSent) {
      setJustSentMediaLoaded(true);
    }
  };

  return (
    <div
      className={`room-message-video-container${
        !isLast ? " room-message-media-margin" : ""
      }`}
      onClick={() => openInNewTab(folders.videos, video)}
    >
      <video
        controls
        onLoadedData={onVideoLoad}
        onError={onVideoLoad}
        ref={videoRef}
        src={fileFromServer(folders.videos, video)}
        className="room-message-video"
      />
    </div>
  );
}
