import React from "react";

const ImagePreview = ({imageUrl}) => {
    //Предпросмотр изображения для загрузки нового поста
    return (
        <div style={{height: '100%',display: 'inline', margin: '5px'}}>
            <img height="200" src={imageUrl} alt="preview" style={{height: '100%', width: '70px', objectFit: 'cover'}} />
        </div>
    )
}

export default ImagePreview