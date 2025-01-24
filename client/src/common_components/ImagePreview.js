import React from "react";

const ImagePreview = ({ isDisplaying, url, onDelete }) => {
  return isDisplaying ? (
    <div>
      <img
        src={url}
        alt="preview"
        style={{ height: "200px", maxWidth: "100%", objectFit: "cover" }}
      />
      <span onClick={() => onDelete(url)} className="cancel-button ml">
        Удалить
      </span>
    </div>
  ) : null;
};

export default ImagePreview;
