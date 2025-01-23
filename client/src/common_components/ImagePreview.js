import React from "react";

const ImagePreview = ({ isDisplaying, url, onDelete }) => {
  return isDisplaying ? (
    <div>
      <img height="200" src={url} alt="preview" />
      <span onClick={() => onDelete(url)} className="cancel-button ml">
        Удалить
      </span>
    </div>
  ) : null;
};

export default ImagePreview;
