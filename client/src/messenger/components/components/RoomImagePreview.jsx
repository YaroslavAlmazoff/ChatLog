import useWindow from "../../hooks/useWindow";
import Times from "./Times";

export default function RoomVideoPreview({ url, deletePreview }) {
  const { handleLoaded } = useWindow();
  return (
    <div className="room-preview-wrapper">
      <img
        src={url}
        alt="uploaded"
        onLoadedData={handleLoaded}
        className="room-preview"
      />
      <Times
        onClick={deletePreview}
        className="room-preview-delete"
        item={url}
      />
    </div>
  );
}
