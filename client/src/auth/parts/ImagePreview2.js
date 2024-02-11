import React from "react";

const ImagePreview2 = ({ imagePreviewDisplay2, imagePreviewUrl2 }) => {
  //Предпросмотр изображения для загрузки фотографии
  return (
    <div
      style={{
        display: imagePreviewDisplay2,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <img
        height="200"
        src={imagePreviewUrl2}
        alt="preview"
        style={{ borderRadius: "15px" }}
      />
    </div>
  );
};

export default ImagePreview2;
