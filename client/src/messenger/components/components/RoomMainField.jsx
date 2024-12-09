import { useState, useRef, forwardRef, useEffect } from "react";
import { useParams } from "react-router";
import sendMessageIcon from "../../img/send-message.png";
import useAPI from "../../hooks/useAPI";
import useFile from "../../hooks/useFile";
import RoomFilesPreview from "./RoomPreview/RoomFilesPreview";
import usePreviews from "../../hooks/usePreviews";
import RoomModal from "./RoomModal/RoomModal";
import { modalTypes } from "../../data/messengerConfiguration";
import RoomSmilesSelectingList from "./RoomSmiles/RoomSmilesSelectingList";
import smile from "../../img/smile.png";
import "../../styles/RoomMainField.css";
import "../../styles/RoomSmiles.css";

const initialState = {
  imageFiles: [],
  videoFiles: [],
  audioFile: null,
};

export default function RoomMainField({
  setRoom,
  setOffset,
  error,
  setErrorCallback,
  setSendLoading,
  editingMessage,
  setEditingMessage,
}) {
  const [modalContent, setModalContent] = useState(null);

  const openModal = (content) => {
    setModalContent(content);
  };

  const closeModal = () => {
    setErrorCallback(false);
    setModalContent(null);
  };

  const { sendMessage, uploadBg, editMessage } = useAPI(
    openModal,
    setErrorCallback
  );
  const { fileTypes } = useFile();
  const { id } = useParams();

  const messageFieldRef = useRef();
  const selectImageRef = useRef();
  const selectVideoRef = useRef();
  const selectBackgroundRef = useRef();

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
    setSendLoading(true);
    if (editingMessage) {
      await editMessage(editingMessage._id, messageFieldRef.current.value);
    } else {
      sendMessage(id, messageFieldRef.current.value, files);
      setOffset((prev) => prev + 1);
    }
    messageFieldRef.current.value = "";
    clearPreviews();
  };

  const handleOpenImageSelect = () => {
    selectImageRef.current.click();
  };

  const handleOpenVideoSelect = () => {
    selectVideoRef.current.click();
  };

  const handleChangeBackground = () => {
    selectBackgroundRef.current.click();
  };

  const getBackgroundImage = async (e) => {
    const bg = await uploadBg(e.target.files[0], id);
    setRoom((prev) => ({ ...prev, bg }));
  };

  const addSmile = (code) => {
    messageFieldRef.current.value = messageFieldRef.current.value + code;
    messageFieldRef.current.focus();
  };

  const openSmiles = () => {
    openModal(<RoomSmilesSelectingList onSmileClick={addSmile} />);
  };

  useEffect(() => {
    console.log(editingMessage);
    if (editingMessage) {
      messageFieldRef.current.value = editingMessage.message;
      messageFieldRef.current.focus();
    }
  }, [editingMessage]);

  return (
    <div className="message-field-area">
      <div className="message-field-actions">
        {canChooseImage && (
          <span onClick={handleOpenImageSelect}>&nbsp;Фотография</span>
        )}
        {canChooseVideo && <span onClick={handleOpenVideoSelect}>Видео</span>}
        <span>Голосовое сообщение</span>
        <span onClick={handleChangeBackground}>Изменить фон</span>
        <img
          onClick={openSmiles}
          src={smile}
          alt="Эмодзи"
          className="message-field-smile"
        />
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
        <input
          onChange={(e) => getBackgroundImage(e)}
          ref={selectBackgroundRef}
          type="file"
          accept=".jpg,.jpeg,.png,.gif"
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
        onClose={closeModal}
        type={error ? modalTypes.error : modalTypes.neutral}
      >
        {modalContent}
      </RoomModal>
    </div>
  );
}
