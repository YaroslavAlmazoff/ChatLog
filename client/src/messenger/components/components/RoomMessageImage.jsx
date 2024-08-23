import useFile from "../../hooks/useFile";
import useWindow from "../../hooks/useWindow";
import { useEffect, useRef, useContext } from "react";
import { folders } from "../../data/messengerConfiguration";
import { ImageLoadContext } from "../../context/ImageLoadContext";
import useImage from "../../hooks/useImage";

export default function RoomMessageImage({ image, index, count }) {
  const singleImage = count === 1;
  const isNotLast = index !== count - 1;

  const { fileFromServer } = useFile();
  const { openInNewTab } = useWindow();
  const { determineImageFormat } = useImage();

  const { registerMedia, handleMediaLoad } = useContext(ImageLoadContext);

  const imageRef = useRef(null);

  useEffect(() => {
    registerMedia();
  }, [registerMedia]);

  const onImageLoad = () => {
    if (singleImage) {
      imageRef.current.classList.add(
        `room-message-single-image-${determineImageFormat(imageRef.current)}`
      );
    }
    handleMediaLoad();
  };

  return (
    <img
      onClick={() => openInNewTab(folders.images, image)}
      src={fileFromServer(folders.images, image)}
      alt={image}
      ref={imageRef}
      onLoad={onImageLoad}
      onError={handleMediaLoad}
      className={`room-message-image
        ${singleImage ? " room-message-single-image" : ""}
        ${isNotLast ? " room-message-media-margin" : ""}
        `}
    />
  );
}
