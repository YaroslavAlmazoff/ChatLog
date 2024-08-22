import useFile from "../../hooks/useFile";
import useWindow from "../../hooks/useWindow";
import { folders } from "../../data/messengerConfiguration";

export default function RoomMessageImages({ images }) {
  const { fileFromServer } = useFile();
  const { openInNewTab } = useWindow();

  return (
    <div className="room-message-images">
      {images.length ? (
        images.map((image, index) => (
          <img
            onClick={() => openInNewTab(folders.images, image)}
            src={fileFromServer(folders.images, image)}
            alt={image}
            className={`${
              images.length === 1
                ? "room-message-single-image"
                : "room-message-image"
            }${
              index !== images.length - 1 ? " room-message-media-margin" : ""
            }`}
          />
        ))
      ) : (
        <></>
      )}
    </div>
  );
}
