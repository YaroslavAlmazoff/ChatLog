import RoomMessageVideosLine from "./RoomMessageVideosLine";

export default function RoomMessageVideos({ videos }) {
  const length = videos.length;
  if (!length) return null;

  const videosLine = videos.slice(0, length === 2 ? 2 : length);

  return (
    <>
      <RoomMessageVideosLine videosLine={videosLine} />
    </>
  );
}
