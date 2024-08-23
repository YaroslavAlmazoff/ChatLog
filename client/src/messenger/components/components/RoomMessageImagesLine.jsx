import RoomMessageImage from "./RoomMessageImage";

export default function RoomMessageImagesLine({ imagesLine }) {
  if (!imagesLine.length) return null;
  return (
    <div
      className={`room-message-images${
        imagesLine.length === 1
          ? " room-message-images-height-single"
          : " room-message-images-height"
      }`}
    >
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
