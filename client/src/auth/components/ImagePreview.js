import React from "react";

const ImagePreview = ({ imageUrl }) => {
  return (
    <div>
      <img height="200" src={imageUrl} alt="preview" />
    </div>
  );
};

export default ImagePreview;
