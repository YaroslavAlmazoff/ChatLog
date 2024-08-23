import RoomMessageImagesLine from "./RoomMessageImagesLine";

export default function RoomMessageImages({ images }) {
  const length = images.length;
  if (!length) return null;

  const firstLineImages = images.slice(0, length >= 3 ? 3 : length);
  const secondLineImages =
    length > 3 ? images.slice(3, length === 6 ? 6 : length) : [];

  return (
    <>
      <RoomMessageImagesLine imagesLine={firstLineImages} />
      <RoomMessageImagesLine imagesLine={secondLineImages} />
    </>
  );
}
