import useFile from "../../../hooks/useFile";
import useWindow from "../../../hooks/useWindow";
import useImage from "../../../hooks/useImage";
import useList from "../../../hooks/useList";
import { useEffect, useRef, useContext } from "react";
import { folders } from "../../../data/messengerConfiguration";
import { ImageLoadContext } from "../../../context/ImageLoadContext";
import { MessageContext } from "../../../context/MessageContext";

export default function RoomMessageImage({ image, index, count }) {
  const { getIsLast, getIsSingle } = useList();
  const { fileFromServer } = useFile();
  const { openInNewTab } = useWindow();
  const { determineImageFormat } = useImage();

  const { setLoadingMessages, setJustSentMessageLoaded, firstLoad } =
    useContext(ImageLoadContext);
  const { message } = useContext(MessageContext);
  const imageRef = useRef(null);

  const isSingle = getIsSingle(count);
  const isLast = getIsLast(index, count);

  const onImageLoad = (e) => {
    if (isSingle) {
      imageRef.current.classList.add(
        `room-message-single-image-${determineImageFormat(imageRef.current)}`
      );
    }
    if (firstLoad ? message.isNew : !message.isNew) {
      setLoadingMessages((prev) => {
        const index = prev.findIndex((it) => it.id === message._id);
        const newArray = [...prev];
        newArray[index].image = true;
        return newArray;
      });
    }
    if (message.isJustSent) {
      setJustSentMessageLoaded(true);
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
