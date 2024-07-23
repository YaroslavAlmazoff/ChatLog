import useFile from "../../hooks/useFile";
import { folders } from "../../data/messengerConfiguration";

export default function RoomMessageImages({ images }) {
  const { fileFromServer } = useFile();

  return (
    <div className="room-message-images">
      {images ? (
        images.map((image, index) => (
          <img
            src={fileFromServer(folders.images, image)}
            alt={image}
            className={`room-message-image${
              index !== images.length - 1 ? "room-message-image-margin" : ""
            }`}
          />
        ))
      ) : (
        <></>
      )}
    </div>
  );
}
