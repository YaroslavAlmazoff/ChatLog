import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import sendMessageIcon from "../../img/send-message.png";
import smile from "../../img/smile.png";
import useAPI from "../../hooks/useAPI";
import useFile from "../../hooks/useFile";
import "../../styles/RoomMessageField.css";
import RoomFilesPreview from "./RoomFilesPreview";
import { errors } from "../../data/errors";
import { limits } from "../../data/messengerConfiguration";

const messageFieldPlaceholder = "Напишите сообщение...";

export default function RoomMessageField() {
  const { sendMessage } = useAPI();
  const { readFiles, fileTypes } = useFile();
  const { id } = useParams();

  const messageFieldRef = useRef();
  const selectImageRef = useRef();
  const selectVideoRef = useRef();

  const initialState = {
    imageFiles: [],
    videoFiles: [],
    audioFile: null,
  };

  const [files, setFiles] = useState(initialState);

  const [filesVisible, setFilesVisible] = useState(false);
  const [canChooseImage, setCanChooseImage] = useState(true);
  const [canChooseVideo, setCanChooseVideo] = useState(true);
  const [error, setError] = useState(null);

  const handleSend = async () => {
    sendMessage(id, messageFieldRef.current.value, files);
    setFiles(initialState);
    setFilesVisible(false);
    setError(null);
  };

  const getFiles = async (e, type) => {
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

  const handleOpenImageSelect = () => {
    selectImageRef.current.click();
  };
  const handleOpenVideoSelect = () => {
    selectVideoRef.current.click();
  };

  useEffect(() => {
    if (error) {
      messageFieldRef.current.style.setProperty(
        "--placeholder-color",
        "#ff073a"
      );
      messageFieldRef.current.style.setProperty("--placeholder-opacity", "1");
      messageFieldRef.current.placeholder = error;
      setTimeout(() => {
        messageFieldRef.current.style.setProperty(
          "--placeholder-color",
          "white"
        );
        messageFieldRef.current.style.setProperty(
          "--placeholder-opacity",
          "0.5"
        );
        messageFieldRef.current.placeholder = messageFieldPlaceholder;
      }, 5000);
    } else {
      messageFieldRef.current.style.setProperty("--placeholder-color", "white");
      messageFieldRef.current.style.setProperty("--placeholder-opacity", "0.5");
      messageFieldRef.current.placeholder = messageFieldPlaceholder;
    }
  }, [error]);

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
          placeholder={messageFieldPlaceholder}
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
        setFiles={setFiles}
        setError={setError}
        filesVisible={filesVisible}
        setCanChooseImage={setCanChooseImage}
        setCanChooseVideo={setCanChooseVideo}
      />
    </div>
  );
}
