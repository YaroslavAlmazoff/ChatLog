import { useContext, useRef, useState } from "react";
import usePhotos from "../hooks/usePhotos";
import useFiles from "../../common_hooks/files.hook";
import ImagePreview from "../../common_components/ImagePreview";
import CommonModal from "../../common_components/Modal/CommonModal";
import { ProfileContext } from "../context/ProfileContext";

const PhotoAction = () => {
  const { setPhotos } = useContext(ProfileContext);
  const { sendPhoto } = usePhotos();
  const { emitOpen, getFile } = useFiles();
  const fileRef = useRef();

  const [file, setFile] = useState(null);
  const [photoPreviewIsDisplaying, setPhotoPreviewIsDisplaying] =
    useState(false);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState("");
  const [publishButtonDisplaying, setPublishButtonDisplaying] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const cancelUploadPhoto = () => {
    setPublishButtonDisplaying(false);
    setPhotoPreviewIsDisplaying(false);
    setPhotoPreviewUrl("");
    setFile("");
  };
  const onFileLoaded = (url) => {
    setPhotoPreviewIsDisplaying(true);
    setPhotoPreviewUrl(url);
    setPublishButtonDisplaying(true);
  };

  const openModalAndFileSelect = () => {
    setShowModal(true);
    emitOpen(fileRef);
  };

  const getSelectedFile = (e) => {
    setFile(getFile(e, onFileLoaded));
  };

  return (
    <>
      {!publishButtonDisplaying && (
        <button
          onClick={openModalAndFileSelect}
          className="dark-button user-action-button"
        >
          Добавить фотографию
        </button>
      )}
      <CommonModal show={showModal} onClose={() => setShowModal(false)}>
        {publishButtonDisplaying && (
          <>
            <button
              onClick={() => sendPhoto(file, setPhotos)}
              className="button"
            >
              Опубликовать
            </button>
            <span className="upload-photo-cancel" onClick={cancelUploadPhoto}>
              Отмена
            </span>
          </>
        )}
        <div>
          <input
            onChange={(e) => getSelectedFile(e)}
            ref={fileRef}
            type="file"
            accept=".jpg,.jpeg,.png,.gif"
          />
          <br />
          <ImagePreview
            isDisplaying={photoPreviewIsDisplaying}
            data={{ url: photoPreviewUrl }}
          />
        </div>
      </CommonModal>
    </>
  );
};

export default PhotoAction;
