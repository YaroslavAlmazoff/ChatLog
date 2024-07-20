import useWindow from "../../hooks/useWindow";
import Times from "./Times";

export default function RoomImagePreview({ url, deletePreview }) {
  const { handleLoaded } = useWindow();
  return (
    <video
      controls
      width="200"
      src={url}
      onLoadedData={handleLoaded}
      className="room-preview"
    >
      <Times
        onClick={deletePreview}
        className="room-preview-delete"
        item={url}
      />
    </video>
  );
}
