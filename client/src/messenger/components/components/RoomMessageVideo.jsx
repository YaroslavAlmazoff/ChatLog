import useFile from "../../hooks/useFile";
import useWindow from "../../hooks/useWindow";
// import { useEffect } from "react";
// import { useContext } from "react";
import { folders } from "../../data/messengerConfiguration";
// import { ImageLoadContext } from "../../context/ImageLoadContext";

export default function RoomMessageVideo({ video, index, count }) {
  const isLast = index !== count - 1;

  const { fileFromServer } = useFile();
  const { openInNewTab } = useWindow();

  //   const { registerImage, handleImageLoad } = useContext(ImageLoadContext);

  //   useEffect(() => {
  //     registerImage();
  //   }, [registerImage]);

  //   const onImageLoad = () => {
  //     handleImageLoad();
  //   };

  return (
    <div
      className={`room-message-video-container${
        !isLast ? " room-message-media-margin" : ""
      }`}
      onClick={() => openInNewTab(folders.videos, video)}
    >
      <video
        controls
        src={fileFromServer(folders.videos, video)}
        className="room-message-video"
      />
    </div>
  );
}
