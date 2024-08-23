import { folders } from "../../../data/messengerConfiguration";
import useFile from "../../../hooks/useFile";

export default function RoomModalVideo({ isVideo, url }) {
  const { fileFromServer } = useFile();

  if (!isVideo) return null;

  return (
    <video
      controls
      src={fileFromServer(folders.videos, url)}
      className="room-modal-video"
    />
  );
}
