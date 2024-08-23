import RoomImagePreview from "./RoomImagePreview";
import RoomVideoPreview from "./RoomVideoPreview";
import "../../../styles/RoomFilesPreview.css";

export default function RoomFilesPreview({
  files,
  filesVisible,
  deletePreview,
}) {
  return filesVisible ? (
    <div className="message-selected-files">
      {files.imageFiles.map((file) => (
        <RoomImagePreview url={file.url} deletePreview={deletePreview} />
      ))}
      {files.videoFiles.map((file) => (
        <RoomVideoPreview url={file.url} deletePreview={deletePreview} />
      ))}
    </div>
  ) : (
    <></>
  );
}
