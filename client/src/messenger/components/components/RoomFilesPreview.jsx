import { useCallback, useEffect } from "react";
import RoomImagePreview from "./RoomImagePreview";
import RoomVideoPreview from "./RoomVideoPreview";
import "../../styles/RoomPreview.css";
import { errors } from "../../data/errors";
import { limits } from "../../data/messengerConfiguration";
import useFile from "../../hooks/useFile";

export default function RoomFilesPreview({
  files,
  setFiles,
  setError,
  filesVisible,
}) {
  const { fileTypes } = useFile();
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

  const slicePreviews = useCallback(
    (type) => {
      setFiles((prev) => ({
        ...prev,
        ...(type === fileTypes.images
          ? { imageFiles: prev.imageFiles.slice(0, limits.images) }
          : { videoFiles: prev.videoFiles.slice(0, limits.videos) }),
      }));
    },
    [setFiles, fileTypes]
  );

  useEffect(() => {
    console.log(
      files.imageFiles.length,
      limits.images,
      files.imageFiles.length > limits.images
    );
    if (files.imageFiles.length > limits.images) {
      setError(errors.imagesCount);
      slicePreviews(fileTypes.images);
    } else if (files.videoFiles.length > limits.videos) {
      setError(errors.videosCount);
      slicePreviews(fileTypes.videos);
    } else {
      setError(null);
    }
  }, [files, setError, fileTypes, slicePreviews]);

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
