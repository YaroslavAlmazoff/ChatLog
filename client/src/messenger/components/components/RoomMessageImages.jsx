import RoomMessageImagesLine from "./RoomMessageImagesLine";

export default function RoomMessageImages({ images }) {
  const length = images.length;
  if (!length) return null;

  const firstLineImages = images.slice(0, length >= 2 ? 2 : length);
  const secondLineImages =
    length > 4 ? images.slice(4, length === 4 ? 4 : length) : [];
  const thirdLineImages =
    length > 6 ? images.slice(6, length === 6 ? 6 : length) : [];

  return (
    <>
      <RoomMessageImagesLine imagesLine={firstLineImages} />
      <RoomMessageImagesLine imagesLine={secondLineImages} />
      <RoomMessageImagesLine imagesLine={thirdLineImages} />
    </>
  );
}
