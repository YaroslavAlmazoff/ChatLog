import useFile from "../../hooks/useFile";

export default function RoomMessageVideos({ videos }) {
  const { fileFromServer } = useFile();

  return (
    <div className="room-message-videos">
      {videos.map((video) => (
        <div className="room-message-video-container">
          <video
            controls
            src={fileFromServer("messagevideos", video)}
            className="room-message-video"
          />
        </div>
      ))}
    </div>
  );
}
