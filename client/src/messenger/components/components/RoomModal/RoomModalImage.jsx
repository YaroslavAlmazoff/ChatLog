import { folders } from "../../../data/messengerConfiguration";
import useFile from "../../../hooks/useFile";

export default function RoomModalImage({ isImage, url }) {
  const { fileFromServer } = useFile();

  if (!isImage) return null;

  return (
    <img
      src={fileFromServer(folders.images, url)}
      alt="media"
      className="room-modal-image"
    />
  );
}
