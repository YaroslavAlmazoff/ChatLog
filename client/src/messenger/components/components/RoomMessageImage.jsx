import useFile from "../../hooks/useFile";
import useWindow from "../../hooks/useWindow";
import { useEffect } from "react";
import { useContext } from "react";
import { folders } from "../../data/messengerConfiguration";
import { ImageLoadContext } from "../../context/ImageLoadContext";

const RoomMessageImage = ({ image, index, count }) => {
  const { fileFromServer } = useFile();
  const { openInNewTab } = useWindow();

  const { registerImage, handleImageLoad } = useContext(ImageLoadContext);

  useEffect(() => {
    registerImage();
  }, [registerImage]);

  return (
    <img
      onClick={() => openInNewTab(folders.images, image)}
      src={fileFromServer(folders.images, image)}
      alt={image}
      onLoad={() => console.log(image + "loadead")}
      onError={handleImageLoad}
      className={`${
        count === 1 ? "room-message-single-image" : "room-message-image"
      }${index !== count - 1 ? " room-message-media-margin" : ""}`}
    />
  );
};

export default RoomMessageImage;
