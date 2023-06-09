import React from "react";

const ImagePreview = ({imageDisplay, imageUrl}) => {
    return (
        <div style={{display: imageDisplay}}>
            <img height="200" src={imageUrl} alt="preview" />
        </div>
    )
}

export default ImagePreview