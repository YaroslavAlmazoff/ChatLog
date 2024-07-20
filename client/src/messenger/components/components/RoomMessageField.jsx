import { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "react-router";
import sendMessageIcon from "../../img/send-message.png";
import smile from "../../img/smile.png";
import useAPI from "../../hooks/useAPI";
import useFile from "../../hooks/useFile";
import "../../styles/RoomMessageField.css";
import RoomFilesPreview from "./RoomFilesPreview";
import { errors } from "../../data/errors";
import { limits } from "../../data/messengerConfiguration";

const initialState = {
  imageFiles: [],
  videoFiles: [],
  audioFile: null,
};
const placeholderText = "Напишите сообщение...";
const placeholderColor = "--placeholder-color";
const placeholderOpacity = "--placeholder-opacity";

export default function RoomMessageField() {
  const { sendMessage } = useAPI();
  const { readFiles, fileTypes } = useFile();
  const { id } = useParams();

  const messageFieldRef = useRef();
  const selectImageRef = useRef();
  const selectVideoRef = useRef();

  const [files, setFiles] = useState(initialState);
  const [canChooseImage, setCanChooseImage] = useState(true);
  const [canChooseVideo, setCanChooseVideo] = useState(true);
  const [filesVisible, setFilesVisible] = useState(false);
  const [error, setError] = useState(null);

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
  }, [error]);

  const slicePreviews = useCallback(
    (type) => {
      setFiles((prev) => ({
        ...prev,
        ...(type === fileTypes.images
          ? { imageFiles: prev.imageFiles.slice(0, limits.images) }
          : { videoFiles: prev.videoFiles.slice(0, limits.videos) }),
      }));
    },
    [fileTypes]
  );

  const clearPreviews = useCallback(() => {
    setFiles(initialState);
    setFilesVisible(false);
    setCanChooseImage(true);
    setCanChooseVideo(true);
    setError(null);
  }, []);

  useEffect(() => {
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
      //clearPreviews();
    }
  }, [files, fileTypes, clearPreviews, slicePreviews]);

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

  const handleSend = async () => {
    sendMessage(id, messageFieldRef.current.value, files);
    clearPreviews();
  };

  const handleOpenImageSelect = () => {
    selectImageRef.current.click();
  };

  const handleOpenVideoSelect = () => {
    selectVideoRef.current.click();
  };

  return (
    <div className="message-field-area">
      <div className="message-field-actions">
        {canChooseImage && (
          <span onClick={handleOpenImageSelect}>Фотография</span>
        )}
        {canChooseVideo && <span onClick={handleOpenVideoSelect}>Видео</span>}
        <span>Голосовое сообщение</span>
        <img src={smile} alt="Эмодзи" className="message-field-smile" />
        <input
          onChange={(e) => getFiles(e, fileTypes.images)}
          ref={selectImageRef}
          type="file"
          accept=".jpg,.jpeg,.png,.gif"
          multiple
        />
        <input
          onChange={(e) => getFiles(e, fileTypes.videos)}
          ref={selectVideoRef}
          type="file"
          accept=".mp4"
          multiple
        />
      </div>
      <div className="message-field-wrapper">
        <input
          type="text"
          ref={messageFieldRef}
          placeholder={placeholderText}
          className="message-field-input"
        />
        <img
          onClick={handleSend}
          src={sendMessageIcon}
          alt="Отправить"
          className="message-field-send"
        />
      </div>
      <RoomFilesPreview
        files={files}
        filesVisible={filesVisible}
        deletePreview={deletePreview}
      />
    </div>
  );
}
