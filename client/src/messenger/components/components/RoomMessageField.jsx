import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import sendMessageIcon from "../../img/send-message.png";
import smile from "../../img/smile.png";
import useAPI from "../../hooks/useAPI";
import useFile from "../../hooks/useFile";
import "../../styles/RoomMessageField.css";
import RoomFilesPreview from "./RoomFilesPreview";

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

  const [filesVisible, setFilesVisible] = useState(false);

  const handleSend = async () => {
    sendMessage(id, messageFieldRef.current.value, files);
    setFilesVisible(false);
  };

  const getFiles = async (e, type) => {
    const files = await readFile(e);
    const result =
      type === fileTypes.images ? { imageFiles: files } : { videoFiles: files };
    setFiles((prev) => ({ ...prev, ...result }));
    setFilesVisible(true);
  };

  const handleOpenImageSelect = () => {
    selectImageRef.current.click();
  };
  const handleOpenVideoSelect = () => {
    selectVideoRef.current.click();
  };

  useEffect(() => {
    console.log(files);
  }, [files]);

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
          placeholder="Напишите сообщение..."
          className="message-field-input"
        />
        <img
          onClick={handleSend}
          src={sendMessageIcon}
          alt="Отправить"
          className="message-field-send"
        />
      </div>
      <RoomFilesPreview files={files} filesVisible={filesVisible} />
    </div>
  );
}
