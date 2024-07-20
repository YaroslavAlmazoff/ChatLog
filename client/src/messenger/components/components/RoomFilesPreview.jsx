import RoomImagePreview from "./RoomImagePreview";
import RoomVideoPreview from "./RoomImagePreview";
import "../../styles/RoomPreview.css";

export default function RoomFilesPreview({ files, filesVisible }) {
  return filesVisible ? (
    <div className="message-selected-files">
      {files.imageFiles.map((file) => (
        <RoomImagePreview url={file.url} />
      ))}
      {files.videoFiles.map((file) => (
        <RoomVideoPreview url={file.url} />
      ))}
    </div>
  ) : (
    <></>
  );
}
