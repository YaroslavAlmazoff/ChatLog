import { useState, useRef } from "react";
import { useParams } from "react-router";
import sendMessageIcon from "../../img/send-message.png";
import smile from "../../img/smile.png";
import useAPI from "../../hooks/useAPI";
import useFile from "../../hooks/useFile";
import "../../styles/RoomMessageField.css";
import RoomFilesPreview from "./RoomFilesPreview";
import usePreviews from "../../hooks/usePreviews";

const initialState = {
  imageFiles: [],
  videoFiles: [],
  audioFile: null,
};

export default function RoomMessageField({ setOffset }) {
  const { sendMessage } = useAPI();
  const { fileTypes } = useFile();
  const { id } = useParams();

  const messageFieldRef = useRef();
  const selectImageRef = useRef();
  const selectVideoRef = useRef();

  const [files, setFiles] = useState(initialState);
  const [canChooseImage, setCanChooseImage] = useState(true);
  const [canChooseVideo, setCanChooseVideo] = useState(true);
  const [filesVisible, setFilesVisible] = useState(false);

  const { messageFieldPlaceholder, getFiles, deletePreview, clearPreviews } =
    usePreviews(
      files,
      setFiles,
      initialState,
      messageFieldRef,
      setFilesVisible,
      setCanChooseImage,
      setCanChooseVideo
    );

  const handleSend = async () => {
    sendMessage(id, messageFieldRef.current.value, files);
    setOffset((prev) => prev++);
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
          <span onClick={handleOpenImageSelect}>&nbsp;Фотография</span>
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
        filesVisible={filesVisible}
        deletePreview={deletePreview}
      />
    </div>
  );
}
