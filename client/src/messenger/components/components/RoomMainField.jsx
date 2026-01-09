import { useState, useRef, useEffect, useContext } from "react";
import { useParams } from "react-router";
import sendMessageIcon from "../../img/send-message.png";
import useAPI from "../../hooks/useAPI";
import useFile from "../../hooks/useFile";
import RoomFilesPreview from "./RoomPreview/RoomFilesPreview";
import usePreviews from "../../hooks/usePreviews";
import RoomModal from "./RoomModal/RoomModal";
import { folders, modalTypes } from "../../data/messengerConfiguration";
import RoomSmilesSelectingList from "./RoomSmiles/RoomSmilesSelectingList";
import smile from "../../img/smile.png";
import "../../styles/RoomMainField.css";
import "../../styles/RoomSmiles.css";
import { EditMessageContext } from "../../context/EditMessageContext";
import useGroupAPI from "../../hooks/useGroupAPI";
import useIsMobile from "../../../common_hooks/isMobile.hook";

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
  isGroup,
}) {
  const { editingMessage, setEditingMessage } = useContext(EditMessageContext);
  const isMobile = useIsMobile();
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
  const { fetchFileFromServer } = useFile();
  const { editGroupMessage, uploadGroupBg, sendGroupMessage } = useGroupAPI();
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
    if (messageFieldRef.current.value) {
      setSendLoading(true);
      if (editingMessage) {
        if (isGroup) {
          await editGroupMessage(
            editingMessage._id,
            messageFieldRef.current.value,
            files
          );
        } else {
          await editMessage(
            editingMessage._id,
            messageFieldRef.current.value,
            files
          );
        }
      } else {
        if (isGroup) {
          await sendGroupMessage(id, messageFieldRef.current.value, files);
        } else {
          await sendMessage(id, messageFieldRef.current.value, files);
        }
        setOffset((prev) => prev + 1);
      }
      messageFieldRef.current.value = "";
      clearPreviews();
    }
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
    const bg = await (isGroup
      ? uploadGroupBg(e.target.files[0], id)
      : uploadBg(e.target.files[0], id));
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
    if (editingMessage) {
      messageFieldRef.current.value = editingMessage.message;
      messageFieldRef.current.focus();
      if (editingMessage.images.length > 0) {
        const files = editingMessage.images.map(async (image) => {
          return await fetchFileFromServer(folders.images, image);
        });
        Promise.all(files).then((images) => getFiles(images, fileTypes.images));
      }
      if (editingMessage.videos.length > 0) {
        const files = editingMessage.videos.map(async (video) => {
          return await fetchFileFromServer(folders.videos, video);
        });
        Promise.all(files).then((videos) => getFiles(videos, fileTypes.videos));
      }
    } else {
      messageFieldRef.current.value = "";
      clearPreviews();
    }
  }, [editingMessage]);

  return (
    <div className="message-field-area">
      <div className="message-field-actions">
        {canChooseImage && (
          <span
            className="message-field-action"
            onClick={handleOpenImageSelect}
          >
            &nbsp;{isMobile ? "Фото" : "Фотография"}
          </span>
        )}
        {canChooseVideo && (
          <span
            className="message-field-action"
            onClick={handleOpenVideoSelect}
          >
            Видео
          </span>
        )}
        <span className="message-field-action">
          Голосовое{!isMobile ? " сообщение" : ""}
        </span>
        <span className="message-field-action" onClick={handleChangeBackground}>
          Cменить фон
        </span>
        <img
          onClick={openSmiles}
          src={smile}
          alt="Эмодзи"
          className="message-field-smile"
        />
        {editingMessage ? (
          <span
            className="message-field-action"
            onClick={() => setEditingMessage(null)}
          >
            &nbsp;Отмена
          </span>
        ) : (
          <></>
        )}
        <input
          onChange={(e) => getFiles(e.target.files, fileTypes.images)}
          ref={selectImageRef}
          type="file"
          accept=".jpg,.jpeg,.png,.gif"
          multiple
        />
        <input
          onChange={(e) => getFiles(e.target.files, fileTypes.videos)}
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
