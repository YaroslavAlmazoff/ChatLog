import React from "react";
import ReactPlayer from "react-player";

const VideoPreview = ({ videoPreviewDisplay, videoPreviewUrl }) => {
  //Предпросмотр изображения для загрузки нового поста
  console.log(videoPreviewUrl);
  return (
    <div style={{ display: videoPreviewDisplay }}>
      {/* <ReactPlayer
        url={videoPreviewUrl}
        controls={true}
        width="100%"
        height="100%"
      /> */}
    </div>
  );
};

export default VideoPreview;
