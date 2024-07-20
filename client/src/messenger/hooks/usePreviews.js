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

  const deletePreview = (url) => {
    setFiles((prev) => ({
      ...prev,
      ...(url.includes("image")
        ? { imageFiles: filterPreviews(prev.imageFiles, url) }
        : { videoFiles: filterPreviews(prev.videoFiles, url) }),
    }));
  };

  const getFiles = async (e, type) => {
    if (!e.target.files[0]) return;
    const isImages = type === fileTypes.images;
    const result = await readFiles(e, isImages ? limits.images : limits.videos);
    console.log(result.files, result.error);
    if (result.error) {
      setError(isImages ? errors.imagesCount : errors.videosCount);
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
    const changePlaceholder = (color, opacity, text) => {
      messageFieldRef.current.style.setProperty(placeholderColor, color);
      messageFieldRef.current.style.setProperty(placeholderOpacity, opacity);
      messageFieldRef.current.placeholder = text;
    };
    if (error) {
      changePlaceholder("#ff073a", 1, error);
      setTimeout(() => {
        changePlaceholder("#fff", 0.5, placeholderText);
      }, 5000);
    } else {
      changePlaceholder("#fff", 0.5, placeholderText);
    }
  }, [error, messageFieldRef]);

  useEffect(() => {
    const slicePreviews = (type) => {
      setFiles((prev) => ({
        ...prev,
        ...(type === fileTypes.images
          ? { imageFiles: prev.imageFiles.slice(0, limits.images) }
          : { videoFiles: prev.videoFiles.slice(0, limits.videos) }),
      }));
    };
    if (files.imageFiles.length > limits.images) {
      setError(errors.imagesCount);
      slicePreviews(fileTypes.images);
    } else if (files.imageFiles.length === limits.images) {
      setCanChooseImage(false);
    } else if (files.videoFiles.length > limits.videos) {
      setError(errors.videosCount);
      slicePreviews(fileTypes.videos);
    } else if (files.videoFiles.length === limits.videos) {
      setCanChooseVideo(false);
    } else {
      setCanChooseImage(true);
      setCanChooseVideo(true);
    }
  }, [
    files,
    setError,
    setFiles,
    fileTypes,
    setCanChooseImage,
    setCanChooseVideo,
    clearPreviews,
  ]);

  return {
    messageFieldPlaceholder: placeholderText,
    getFiles,
    deletePreview,
    clearPreviews,
  };
}
