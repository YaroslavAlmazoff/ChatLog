import React from "react";

const ImagePreview = ({imageUrl}) => {
    //Предпросмотр изображения для загрузки нового поста
    return (
        <div>
            <img height="200" src={imageUrl} alt="preview" />
        </div>
    )
}

export default ImagePreview