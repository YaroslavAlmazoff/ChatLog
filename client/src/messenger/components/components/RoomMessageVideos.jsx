import { videosInLine } from "../../data/messengerConfiguration";
import RoomMessageVideosLine from "./RoomMessageVideosLine";

export default function RoomMessageVideos({ videos }) {
  const length = videos.length;
  if (!length) return null;

  const lines = [];

  for (let i = 0; i < length / videosInLine; i++) {
    lines.push(videos.slice(i * videosInLine, (i + 1) * videosInLine));
  }

  //const videosLine = videos.slice(0, length === 2 ? 2 : length);

  return (
    <>
      {lines.map((line) => (
        <RoomMessageVideosLine videosLine={line} />
      ))}
      {/* <RoomMessageVideosLine videosLine={videosLine} /> */}
    </>
  );
}
