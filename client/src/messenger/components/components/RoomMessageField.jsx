import { useRef, useState } from "react";
import { useParams } from "react-router";
import sendMessageIcon from "../../img/send-message.png";
import useAPI from "../../hooks/useAPI";
import useFile from "../../hooks/useFile";
import RoomImagePreview from "./RoomImagePreview";
import RoomVideoPreview from "./RoomImagePreview";
import "../../styles/RoomMessageField.css";

export default function RoomMessageField() {
  const { sendMessage } = useAPI();
  const { readFile, fileTypes } = useFile();
  const { id } = useParams();
  const messageFieldRef = useRef();
  const selectImageRef = useRef();
  const selectVideoRef = useRef();

  const [files, setFiles] = useState({
    imageFiles: [],
    videoFiles: [],
    audioFile: null,
  });

  const handleSend = async () => {
    sendMessage(id, messageFieldRef.current.value, files);
  };

  const getFiles = (e, type) => {
    const files = readFile(e);
    const result =
      type === fileTypes.images ? { imageFiles: files } : { videoFiles: files };
    setFiles((prev) => ({ ...prev, ...result }));
  };

  const handleOpenImageSelect = () => {
    selectImageRef.current.click();
  };
  const handleOpenVideoSelect = () => {
    selectVideoRef.current.click();
  };

  return (
    <div className="message-field-area">
      {files.imageFiles.length || files.videoFiles.length ? (
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
      )}
      <div className="message-field-actions">
        <span onClick={handleOpenImageSelect}>Фотография</span>
        <span onClick={handleOpenVideoSelect}>Видео</span>
        <span>Голосовое сообщение</span>
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
          className="message-field-input"
        />
        <img
          onClick={handleSend}
          src={sendMessageIcon}
          alt="Отправить"
          className="message-field-send"
        />
      </div>
    </div>
  );
}
