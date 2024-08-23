import useFile from "../../hooks/useFile";
import useWindow from "../../hooks/useWindow";
import { useEffect, useContext } from "react";
import { folders } from "../../data/messengerConfiguration";
import { ImageLoadContext } from "../../context/ImageLoadContext";

export default function RoomMessageVideo({ video, index, count }) {
  const isLast = index !== count - 1;

  const { fileFromServer } = useFile();
  const { openInNewTab } = useWindow();

  const { registerMedia, handleMediaLoad } = useContext(ImageLoadContext);

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
