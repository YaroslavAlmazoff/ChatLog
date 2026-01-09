import { videosInLine } from "../../../data/messengerConfiguration";
import RoomMessageVideosLine from "./RoomMessageVideosLine";

export default function RoomMessageVideos({ videos, onVideoLoaded }) {
  const length = videos.length;
  if (!length) return null;

  const lines = [];

  for (let i = 0; i < length / videosInLine; i++) {
    lines.push(videos.slice(i * videosInLine, (i + 1) * videosInLine));
  }

  return (
    <div className="room-message-videos">
      {lines.map((line) => (
        <RoomMessageVideosLine
          videosLine={line}
          key={JSON.stringify(line)}
          onVideoLoaded={onVideoLoaded}
        />
      ))}
    </div>
  );
}
