import useWindow from "../../hooks/useWindow";
import "../../styles/RoomPreview.css";

export default function RoomImagePreview({ url }) {
  const { handleLoaded } = useWindow();
  return (
    <video
      controls
      width="200"
      src={url}
      onLoadedData={handleLoaded}
      className="room-preview"
    />
  );
}
