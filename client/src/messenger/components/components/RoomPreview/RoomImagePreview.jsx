import useWindow from "../../../hooks/useWindow";
import RoomPreviewTimes from "./RoomPreviewTimes";

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
      <RoomPreviewTimes
        onClick={deletePreview}
        className="room-preview-delete"
        item={url}
      />
    </div>
  );
}
