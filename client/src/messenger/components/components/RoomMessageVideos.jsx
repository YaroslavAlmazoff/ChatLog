import useFile from "../../hooks/useFile";
import useWindow from "../../hooks/useWindow";
import { folders } from "../../data/messengerConfiguration";

export default function RoomMessageVideos({ videos }) {
  const { fileFromServer } = useFile();
  const { openInNewTab } = useWindow();

  return (
    <div className="room-message-videos">
      {videos ? (
        videos.map((video, index) => (
          <div
            className={`room-message-video-container${
              index !== videos.length - 1 ? " room-message-media-margin" : ""
            }`}
            onClick={() => openInNewTab(folders.videos, video)}
          >
            <video
              controls
              src={fileFromServer(folders.videos, video)}
              className="room-message-video"
            />
          </div>
        ))
      ) : (
        <></>
      )}
    </div>
  );
}
