import useFile from "../../../hooks/useFile";
import useWindow from "../../../hooks/useWindow";
import useList from "../../../hooks/useList";
import { useEffect, useContext } from "react";
import { folders } from "../../../data/messengerConfiguration";
import { ImageLoadContext } from "../../../context/ImageLoadContext";

export default function RoomMessageVideo({ video, index, count, isNew }) {
  const { getIsLast } = useList();

  const { fileFromServer } = useFile();
  const { openInNewTab } = useWindow();

  const { registerMedia, loadMedia } = useContext(ImageLoadContext);

  const isLast = getIsLast(index, count);

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
        onLoadedData={isNew ? loadMedia : () => {}}
        onError={isNew ? loadMedia : () => {}}
        src={fileFromServer(folders.videos, video)}
        className="room-message-video"
      />
    </div>
  );
}
