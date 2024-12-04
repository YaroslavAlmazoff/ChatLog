import RoomMessageImagesLine from "./RoomMessageImagesLine";
import { imagesInLine } from "../../../data/messengerConfiguration";

export default function RoomMessageImages({ images, onImageLoaded }) {
  const length = images.length;
  if (!length) return null;

  const lines = [];

  for (let i = 0; i < length / imagesInLine; i++) {
    lines.push(images.slice(i * imagesInLine, (i + 1) * imagesInLine));
  }

  return (
    <div className="room-message-images">
      {lines.map((line, index) => (
        <RoomMessageImagesLine
          imagesLine={line}
          index={index}
          count={length}
          key={JSON.stringify(line)}
          onImageLoaded={onImageLoaded}
        />
      ))}
    </div>
  );
}
