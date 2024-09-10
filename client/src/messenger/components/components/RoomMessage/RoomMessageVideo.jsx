import useFile from "../../../hooks/useFile";
import useWindow from "../../../hooks/useWindow";
import useList from "../../../hooks/useList";
import { useEffect, useContext } from "react";
import { folders } from "../../../data/messengerConfiguration";
import { ImageLoadContext } from "../../../context/ImageLoadContext";
import { MessageContext } from "../../../context/MessageContext";
import useImage from "../../../hooks/useImage";

export default function RoomMessageVideo({ video, index, count }) {
  const { getIsLast } = useList();

  const { fileFromServer } = useFile();
  const { openInNewTab } = useWindow();
  const { determineImageFormat } = useImage();

  const { registerMedia, loadMedia, setJustSentMediaLoaded } =
    useContext(ImageLoadContext);
  const { message } = useContext(MessageContext);

  const isLast = getIsLast(index, count);

  useEffect(() => {
    registerMedia();
  }, [registerMedia]);

  const onVideoLoad = (e) => {
    if (isSingle) {
      imageRef.current.classList.add(
        `room-message-single-video-${determineImageFormat(imageRef.current)}`
      );
    }
    if (message.isNew) {
      console.log(e.target.clientHeight);
      loadMedia(e.target.clientHeight);
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
        src={fileFromServer(folders.videos, video)}
        className="room-message-video"
      />
    </div>
  );
}
