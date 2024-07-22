import useFile from "../../hooks/useFile";

export default function RoomMessageImages({ images }) {
  const { fileFromServer } = useFile();

  return (
    <div className="room-message-images">
      {images ? (
        images.map((image) => (
          <img
            src={fileFromServer("messageimages", image)}
            alt={image}
            className="room-message-image"
          />
        ))
      ) : (
        <></>
      )}
    </div>
  );
}
