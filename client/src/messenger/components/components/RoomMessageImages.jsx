import useFile from "../../hooks/useFile";
import { folders } from "../../data/messengerConfiguration";
import { useNavigate } from "react-router";

export default function RoomMessageImages({ images }) {
  const navigate = useNavigate();
  const { fileFromServer } = useFile();

  return (
    <div className="room-message-images">
      {images ? (
        images.map((image, index) => (
          <img
            onClick={() => navigate(fileFromServer(folders.images, image))}
            src={fileFromServer(folders.images, image)}
            alt={image}
            className={`room-message-image${
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
