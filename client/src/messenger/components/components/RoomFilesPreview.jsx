import RoomImagePreview from "./RoomImagePreview";
import RoomVideoPreview from "./RoomVideoPreview";
import "../../styles/RoomPreview.css";
import { useEffect } from "react";

export default function RoomFilesPreview({
  files,
  filesVisible,
  deletePreview,
}) {
  useEffect(() => {
    console.log(files);
  }, [files]);

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
