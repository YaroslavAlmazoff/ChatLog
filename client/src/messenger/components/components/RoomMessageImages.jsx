import RoomMessageImagesLine from "./RoomMessageImagesLine";

export default function RoomMessageImages({ images }) {
  const length = images.length;
  if (!length) return null;

  const firstLineImages = images.slice(0, length >= 2 ? 2 : length);
  const secondLineImages =
    length > 2 ? images.slice(2, length === 4 ? 4 : length) : [];
  const thirdLineImages =
    length > 4 ? images.slice(4, length === 6 ? 6 : length) : [];

  return (
    <>
      <RoomMessageImagesLine imagesLine={firstLineImages} />
      <RoomMessageImagesLine imagesLine={secondLineImages} />
      <RoomMessageImagesLine imagesLine={thirdLineImages} />
    </>
  );
}
