import RoomMessageVideo from "./RoomMessageVideo";

export default function RoomMessageVideosLine({ videosLine, onVideoLoaded }) {
  const length = videosLine.length;
  if (!length) return null;

  return (
    <div className="room-message-videos-line">
      {videosLine.map((video, index) => (
        <RoomMessageVideo
          video={video}
          index={index}
          count={length}
          key={video}
          onVideoLoaded={onVideoLoaded}
        />
      ))}
    </div>
  );
}
