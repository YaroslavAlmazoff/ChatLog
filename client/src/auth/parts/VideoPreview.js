import React from "react";
import ReactPlayer from "react-player";

const VideoPreview = ({ videoPreviewDisplay, videoPreviewUrl }) => {
  //Предпросмотр изображения для загрузки нового поста

  const handleVideoLoad = () => {
    window.scrollTo(0, document.body.scrollHeight);
  };
  return (
    <div style={{ display: videoPreviewDisplay, marginTop: "15px" }}>
      <video
        width="200"
        controls
        src={videoPreviewUrl}
        onLoadedData={handleVideoLoad}
      ></video>
    </div>
  );
};

export default VideoPreview;
