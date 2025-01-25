import { useContext, useRef, useState } from "react";
import usePhotos from "../hooks/usePhotos";
import ImagePreview from "../../common_components/ImagePreview";
import CommonModal from "../../common_components/Modal/CommonModal";
import { ProfileContext } from "../context/ProfileContext";

const PhotoAction = () => {
  const { setPhotos } = useContext(ProfileContext);
  const { sendPhoto } = usePhotos();
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

  const emitOpen = () => {
    fileRef.current.click();
  };
  const getFile = async (e) => {
    let file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      setPhotoPreviewIsDisplaying(true);
      setPhotoPreviewUrl(event.target.result);
      setPublishButtonDisplaying(true);
    };
    reader.readAsDataURL(file);
    setFile(file);
  };

  return (
    <>
      {!publishButtonDisplaying && (
        <button
          onClick={() => setShowModal(true)}
          className="dark-button user-action-button"
        >
          Добавить фотографию
        </button>
      )}
      <CommonModal show={showModal} onClose={() => setShowModal(false)}>
        {!publishButtonDisplaying && (
          <button onClick={emitOpen} className="dark-button user-action-button">
            Загрузить фотографию
          </button>
        )}
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
            onChange={(e) => getFile(e)}
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
