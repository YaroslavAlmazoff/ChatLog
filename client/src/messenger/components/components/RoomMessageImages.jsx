import RoomMessageImage from "./RoomMessageImage";

export default function RoomMessageImages({ images }) {
  return (
    <div className="room-message-images">
      {images.length ? (
        images.map((image, index) => (
          <RoomMessageImage image={image} index={index} count={images.length} />
        ))
      ) : (
        <></>
      )}
    </div>
  );
}
