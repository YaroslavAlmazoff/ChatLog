import RoomImagePreview from "./RoomImagePreview";
import RoomVideoPreview from "./RoomVideoPreview";
import "../../styles/RoomPreview.css";

export default function RoomFilesPreview({ files, setFiles, filesVisible }) {
  const filterPreviews = (filterable, url) =>
    [...filterable].filter((item) => item.url !== url);

  const deletePreview = (url) => {
    setFiles((prev) => ({
      ...prev,
      ...(url.includes("image")
        ? { imageFiles: filterPreviews(prev.imageFiles, url) }
        : { videoFiles: filterPreviews(prev.videoFiles, url) }),
    }));
  };
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
