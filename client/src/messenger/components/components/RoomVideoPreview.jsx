import useWindow from "../../hooks/useWindow";

export default function RoomImagePreview({ url }) {
  const { handleLoaded } = useWindow();
  return <video controls width="200" src={url} onLoadedData={handleLoaded} />;
}
