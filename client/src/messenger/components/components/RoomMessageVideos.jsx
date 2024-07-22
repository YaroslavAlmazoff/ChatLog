import useFile from "../../hooks/useFile";
import { folders } from "../../data/messengerConfiguration";

export default function RoomMessageVideos({ videos }) {
  const { fileFromServer } = useFile();

  return (
    <div className="room-message-videos">
      {videos ? (
        videos.map((video) => (
          <div className="room-message-video-container">
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
