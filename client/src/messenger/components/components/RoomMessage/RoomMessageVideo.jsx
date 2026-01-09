import useFile from "../../../hooks/useFile";
import useWindow from "../../../hooks/useWindow";
import useList from "../../../hooks/useList";
import useImage from "../../../hooks/useImage";
import { useState, useEffect, useContext, useRef } from "react";
import { folders } from "../../../data/messengerConfiguration";
import { ImageLoadContext } from "../../../context/ImageLoadContext";
import { MessageContext } from "../../../context/MessageContext";

export default function RoomMessageVideo({
  video,
  index,
  count,
  onVideoLoaded,
}) {
  const { getIsLast, getIsSingle } = useList();

  const { fileFromServer } = useFile();
  const { openInNewTab } = useWindow();
  const { determineImageFormat } = useImage();

  const { register, load } = useContext(ImageLoadContext);
  const { message } = useContext(MessageContext);
  const videoRef = useRef(null);

  const isLast = getIsLast(index, count);
  const isSingle = getIsSingle(count);

  useEffect(() => {
    if (message.isNew) {
      register();
    }
  }, []);

  const onVideoLoad = (e) => {
    if (isSingle) {
      videoRef.current.classList.add(
        `room-message-single-video-${determineImageFormat(videoRef.current)}`
      );
    }
    if (message.isNew) {
      load();
      onVideoLoaded();
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
