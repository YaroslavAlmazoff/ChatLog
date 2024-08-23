import RoomMessageImage from "./RoomMessageImage";

export default function RoomMessageImagesLine({ imagesLine }) {
  return (
    <div className="room-message-images">
      {imagesLine.map((image, index) => (
        <RoomMessageImage
          image={image}
          index={index}
          count={imagesLine.length}
        />
      ))}
    </div>
  );
}
