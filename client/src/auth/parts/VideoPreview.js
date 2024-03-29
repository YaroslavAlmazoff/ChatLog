import React from "react";
import ReactPlayer from "react-player";

const VideoPreview = ({ videoPreviewDisplay, videoPreviewUrl }) => {
  //Предпросмотр изображения для загрузки нового поста
  console.log(videoPreviewUrl);
  return (
    <div style={{ display: videoPreviewDisplay }}>
      <video width="300" controls src={videoPreviewUrl}></video>
    </div>
  );
};

export default VideoPreview;
