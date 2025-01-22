import { useRef, useState } from "react";
import usePhotos from "../hooks/usePhotos";
import useFiles from "../../common_hooks/files.hook";
import ImagePreview from "../../common_components/ImagePreview";

const PhotoAction = ({ setPhotos }) => {
  const { sendPhoto } = usePhotos();
  const { emitOpen, getFiles } = useFiles();
  const fileRef = useRef();

  const [file, setFile] = useState(null);
  const [photoPreviewIsDisplaying, setPhotoPreviewIsDisplaying] =
    useState(false);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState("");
  const [publishButtonDisplaying, setPublishButtonDisplaying] = useState(false);

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
  return (
    <>
      {!publishButtonDisplaying && (
        <button
          onClick={(e) => emitOpen(e)}
          className="dark-button user-action-button"
        >
          Добавить фотографию
        </button>
      )}
      {publishButtonDisplaying && (
        <>
          <button onClick={() => sendPhoto(file, setPhotos)} className="button">
            Опубликовать
          </button>
          <span className="upload-photo-cancel" onClick={cancelUploadPhoto}>
            Отмена
          </span>
        </>
      )}
      <div>
        <input
          onChange={(e) => getFiles(e, onFileLoaded)}
          ref={fileRef}
          type="file"
          accept=".jpg,.jpeg,.png,.gif"
        />
        <br />
        <ImagePreview
          isDisplaying={photoPreviewIsDisplaying}
          url={photoPreviewUrl}
        />
      </div>
    </>
  );
};

export default PhotoAction;
