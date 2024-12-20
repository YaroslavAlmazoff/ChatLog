import useFile from "../../../hooks/useFile";
import useWindow from "../../../hooks/useWindow";
import useImage from "../../../hooks/useImage";
import useList from "../../../hooks/useList";
import { useEffect, useRef, useContext } from "react";
import { folders } from "../../../data/messengerConfiguration";
import { ImageLoadContext } from "../../../context/ImageLoadContext";
import { MessageContext } from "../../../context/MessageContext";

export default function RoomMessageImage({
  image,
  index,
  count,
  onImageLoaded,
}) {
  const { getIsLast, getIsSingle } = useList();
  const { fileFromServer } = useFile();
  const { openInNewTab } = useWindow();
  const { determineImageFormat } = useImage();

  const { register, load } = useContext(ImageLoadContext);
  const { message } = useContext(MessageContext);
  const imageRef = useRef(null);

  const isSingle = getIsSingle(count);
  const isLast = getIsLast(index, count);

  useEffect(() => {
    if (message.isNew) {
      register();
    }
  }, []);

  const onImageLoad = (e) => {
    if (isSingle) {
      imageRef.current.classList.add(
        `room-message-single-image-${determineImageFormat(imageRef.current)}`
      );
    }
    if (message.isNew) {
      load();
      onImageLoaded();
    }
  };

  return (
    <img
      onClick={() => openInNewTab(folders.images, image)}
      src={fileFromServer(folders.images, image)}
      alt={image}
      ref={imageRef}
      onLoad={onImageLoad}
      onError={onImageLoad}
      className={`room-message-image
        ${isSingle ? " room-message-single-image" : ""}
        ${!isLast ? " room-message-media-margin" : ""}
        `}
      id={image}
    />
  );
}
