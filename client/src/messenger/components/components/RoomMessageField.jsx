import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import sendMessageIcon from "../../img/send-message.png";
import smile from "../../img/smile.png";
import useAPI from "../../hooks/useAPI";
import useFile from "../../hooks/useFile";
import "../../styles/RoomMessageField.css";
import RoomFilesPreview from "./RoomFilesPreview";
import { errors } from "../../data/errors";

const imagesLimit = 6;
const videosLimit = 2;
const messageFieldPlaceholder = "Напишите сообщение...";

export default function RoomMessageField() {
  const { sendMessage } = useAPI();
  const { readFiles, fileTypes } = useFile();
  const { id } = useParams();
  const messageFieldRef = useRef();
  const selectImageRef = useRef();
  const selectVideoRef = useRef();

  const [files, setFiles] = useState({
    imageFiles: [],
    videoFiles: [],
    audioFile: null,
  });

  const [filesVisible, setFilesVisible] = useState(false);
  const [error, setError] = useState(null);

  const handleSend = async () => {
    sendMessage(id, messageFieldRef.current.value, files);
    setFilesVisible(false);
  };

  const getFiles = async (e, type) => {
    const isImages = type === fileTypes.images;

    const { files, error } = await readFiles(e, isImages ? 6 : 2);

    if (error) {
      setError(
        isImages
          ? errors.imagesCount(imagesLimit)
          : errors.videosCount(videosLimit)
      );
    }

    setFiles((prev) => ({
      ...prev,
      ...(isImages
        ? { imageFiles: [...prev.imageFiles, ...files] }
        : { videoFiles: [...prev.videoFiles, ...files] }),
    }));
    setFilesVisible(true);
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
      messageFieldRef.current.placeholder = error;
    } else {
      messageFieldRef.current.style.setProperty("--placeholder-color", "grey");
      messageFieldRef.current.placeholder = messageFieldPlaceholder;
    }
  }, [error]);

  return (
    <div className="message-field-area">
      <div className="message-field-actions">
        <span onClick={handleOpenImageSelect}>Фотография</span>
        <span onClick={handleOpenVideoSelect}>Видео</span>
        <span>Голосовое сообщение</span>
        <img src={smile} alt="Эмодзи" className="message-field-smile" />
        <input
          onChange={(e) => getFiles(e, fileTypes.images)}
          ref={selectImageRef}
          type="file"
          accept=".jpg,.jpeg,.png,.gif"
        />
        <input
          onChange={(e) => getFiles(e, fileTypes.videos)}
          ref={selectVideoRef}
          type="file"
          accept=".mp4"
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
        filesVisible={filesVisible}
      />
    </div>
  );
}
