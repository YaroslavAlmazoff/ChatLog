import React from "react";

const ImagePreview = ({ isDisplaying, data, onDelete }) => {
  return isDisplaying ? (
    <div>
      <img
        src={data.url}
        alt="preview"
        style={{ height: "200px", maxWidth: "100%", objectFit: "cover" }}
      />
      {onDelete ? (
        <span onClick={() => onDelete(data)} className="cancel-button ml">
          Удалить
        </span>
      ) : (
        <></>
      )}
    </div>
  ) : null;
};

export default ImagePreview;
