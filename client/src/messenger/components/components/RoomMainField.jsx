import { useState, useRef } from "react";
import { useParams } from "react-router";
import sendMessageIcon from "../../img/send-message.png";
import smile from "../../img/smile.png";
import useAPI from "../../hooks/useAPI";
import useFile from "../../hooks/useFile";
import RoomFilesPreview from "./RoomPreview/RoomFilesPreview";
import usePreviews from "../../hooks/usePreviews";
import RoomModal from "./RoomModal/RoomModal";
import { modalTypes } from "../../data/messengerConfiguration";
import "../../styles/RoomMainField.css";

const initialState = {
  imageFiles: [],
  videoFiles: [],
  audioFile: null,
};

export default function RoomMainField({ setOffset }) {
  const [modalContent, setModalContent] = useState(null);

  const toggleModal = (content) => {
    setModalContent(content);
  };

  const { sendMessage } = useAPI(toggleModal);
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
    setOffset((prev) => prev + 1);
    messageFieldRef.current.value = "";
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
      <RoomModal
        show={!!modalContent}
        onClose={() => toggleModal(null)}
        type={modalTypes.error}
      >
        {modalContent}
      </RoomModal>
    </div>
  );
}
