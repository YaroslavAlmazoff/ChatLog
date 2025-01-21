import React from "react";

const ImagePreview = ({ isDisplaying, url }) => {
  return isDisplaying ? (
    <div>
      <img height="200" src={url} alt="preview" />
    </div>
  ) : null;
};

export default ImagePreview;
