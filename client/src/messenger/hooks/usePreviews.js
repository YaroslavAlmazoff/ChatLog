import { useState, useEffect, useCallback } from "react";
import useFile from "./useFile";
import { errors } from "../data/errors";
import { limits } from "../data/messengerConfiguration";

const placeholderText = "Напишите сообщение...";
const placeholderColor = "--placeholder-color";
const placeholderOpacity = "--placeholder-opacity";

export default function usePreviews(
  files,
  setFiles,
  initialState,
  messageFieldRef,
  setFilesVisible,
  setCanChooseImage,
  setCanChooseVideo
) {
  const { readFiles, fileTypes } = useFile();

  const [error, setError] = useState(null);

  const filterPreviews = (filterable, url) =>
    [...filterable].filter((item) => item.url !== url);

  const toggleCanChoose = (can, isImages) => {
    isImages ? setCanChooseImage(can) : setCanChooseVideo(can);
  };

  const deletePreview = (url) => {
    const isImages = url.includes("image");
    setFiles((prev) => ({
      ...prev,
      ...(isImages
        ? { imageFiles: filterPreviews(prev.imageFiles, url) }
        : { videoFiles: filterPreviews(prev.videoFiles, url) }),
    }));
    toggleCanChoose(true, isImages);
  };

  const slicePreviews = (oldPreviews, newPreviews, isImages) => {
    return {
      ...oldPreviews,
      ...(isImages
        ? {
            imageFiles: [...oldPreviews.imageFiles, ...newPreviews].slice(
              0,
              limits.images
            ),
          }
        : {
            videoFiles: [...oldPreviews.videoFiles, ...newPreviews].slice(
              0,
              limits.videos
            ),
          }),
    };
  };

  const previewsOverflow = (result, isImages) => {
    setFiles((prev) => slicePreviews(prev, result.files, isImages));
    isImages ? setCanChooseImage(false) : setCanChooseVideo(false);
  };

  const getFiles = async (e, type) => {
    if (!e.target.files[0]) return;
    const isImages = type === fileTypes.images;
    const result = await readFiles(e, isImages ? limits.images : limits.videos);
    console.log(result.files, result.error);
    const currentLength =
      result.files.length +
      (isImages ? files.imageFiles.length : files.videoFiles.length);
    const currentLimits = isImages ? limits.images : limits.videos;
    if (result.error || currentLength > currentLimits) {
      previewsOverflow(result, isImages);
      setError(isImages ? errors.imagesCount : errors.videosCount);
    } else if (currentLength === currentLimits) {
      previewsOverflow(result, isImages);
    } else {
      setFiles((prev) => ({
        ...prev,
        ...(isImages
          ? { imageFiles: [...prev.imageFiles, ...result.files] }
          : { videoFiles: [...prev.videoFiles, ...result.files] }),
      }));
      setFilesVisible(true);
    }
  };

  const clearPreviews = useCallback(() => {
    setFiles(initialState);
    setFilesVisible(false);
    setCanChooseImage(true);
    setCanChooseVideo(true);
    setError(null);
  }, [
    setFiles,
    initialState,
    setCanChooseImage,
    setCanChooseVideo,
    setFilesVisible,
  ]);

  useEffect(() => {
    console.log("error changed");
    const changePlaceholder = (color, opacity, text) => {
      messageFieldRef.current.style.setProperty(placeholderColor, color);
      messageFieldRef.current.style.setProperty(placeholderOpacity, opacity);
      messageFieldRef.current.placeholder = text;
    };
    if (error) {
      console.log("error is true", error);
      changePlaceholder("#ff073a", 1, error);
      setTimeout(() => {
        changePlaceholder("#fff", 0.5, placeholderText);
        setError(null);
      }, 5000);
    } else {
      changePlaceholder("#fff", 0.5, placeholderText);
    }
  }, [error, messageFieldRef]);

  return { placeholderText, getFiles, deletePreview, clearPreviews };
}
