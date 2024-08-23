import useFile from "../../../hooks/useFile";
import useWindow from "../../../hooks/useWindow";
import { useEffect, useContext } from "react";
import { folders } from "../../../data/messengerConfiguration";
import { ImageLoadContext } from "../../../context/ImageLoadContext";
import useList from "../../../hooks/useList";

export default function RoomMessageVideo({ video, index, count }) {
  const { getIsLast } = useList();

  const { fileFromServer } = useFile();
  const { openInNewTab } = useWindow();

  const { registerMedia, handleMediaLoad } = useContext(ImageLoadContext);

  const isLast = getIsLast();

  useEffect(() => {
    registerMedia();
  }, [registerMedia]);

  return (
    <div
      className={`room-message-video-container${
        !isLast ? " room-message-media-margin" : ""
      }`}
      onClick={() => openInNewTab(folders.videos, video)}
    >
      <video
        controls
        onLoadedData={handleMediaLoad}
        onError={handleMediaLoad}
        src={fileFromServer(folders.videos, video)}
        className="room-message-video"
      />
    </div>
  );
}
