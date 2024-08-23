import useFile from "../../hooks/useFile";
import useWindow from "../../hooks/useWindow";
import { useEffect, useRef } from "react";
import { useContext } from "react";
import { folders } from "../../data/messengerConfiguration";
import { ImageLoadContext } from "../../context/ImageLoadContext";
import useImage from "../../hooks/useImage";

const RoomMessageImage = ({ image, index, count }) => {
  const { fileFromServer } = useFile();
  const { openInNewTab } = useWindow();
  const { determineImageFormat } = useImage();

  const { registerImage, handleImageLoad } = useContext(ImageLoadContext);

  const imageRef = useRef(null);

  useEffect(() => {
    registerImage();
  }, [registerImage]);

  const onImageLoad = () => {
    imageRef.current.classList.add(
      `room-message-single-image-${determineImageFormat(imageRef.current)}`
    );
    handleImageLoad();
  };

  return (
    <img
      onClick={() => openInNewTab(folders.images, image)}
      src={fileFromServer(folders.images, image)}
      alt={image}
      ref={imageRef}
      onLoad={onImageLoad}
      onError={handleImageLoad}
      className={`room-message-image${
        count === 1 ? ` room-message-single-image` : ""
      }${index !== count - 1 ? " room-message-media-margin" : ""}`}
    />
  );
};

export default RoomMessageImage;
