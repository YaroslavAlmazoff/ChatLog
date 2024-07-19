import useWindow from "../../hooks/useWindow";
import "../../styles/RoomPreview.css";

export default function RoomVideoPreview({ url }) {
  const { handleLoaded } = useWindow();
  return (
    <img
      src={url}
      alt="uploaded"
      onLoadedData={handleLoaded}
      className="room-preview"
    />
  );
}
