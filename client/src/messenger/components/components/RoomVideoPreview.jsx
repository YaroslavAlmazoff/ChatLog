import useWindow from "../../hooks/useWindow";
import Times from "./Times";

export default function RoomImagePreview({ url, deletePreview }) {
  const { handleLoaded } = useWindow();
  return (
    <div className="room-preview-wrapper">
      <video
        autoPlay
        loop
        muted
        src={url}
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
