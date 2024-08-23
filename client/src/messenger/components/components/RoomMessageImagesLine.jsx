import RoomMessageImage from "./RoomMessageImage";

export default function RoomMessageImagesLine({ imagesLine }) {
  if (!imagesLine.length) return null;
  return (
    <div
      className={`room-message-images-line${
        imagesLine.length === 1
          ? " room-message-images-line-height-single"
          : " room-message-images-line-height"
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
