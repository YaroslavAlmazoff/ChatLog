import useList from "../../../hooks/useList";
import RoomMessageImage from "./RoomMessageImage";

export default function RoomMessageImagesLine({
  imagesLine,
  index,
  count,
  onImageLoaded,
}) {
  const { getIsLast, getIsSingle } = useList();

  if (!imagesLine.length) return null;

  const isLast = getIsLast(index, count);
  const isSingle = getIsSingle(count);

  return (
    <div
      className={`room-message-images-line${
        isSingle
          ? " room-message-images-line-height-single"
          : " room-message-images-line-height"
      }${!isLast ? " room-message-images-margin-bottom" : ""}`}
    >
      {imagesLine.map((image, index) => (
        <RoomMessageImage
          image={image}
          index={index}
          count={imagesLine.length}
          key={image}
          onImageLoaded={onImageLoaded}
        />
      ))}
    </div>
  );
}
