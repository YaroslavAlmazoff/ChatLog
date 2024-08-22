import React, { createContext, useState } from "react";

// Создаем контекст
export const ImageLoadContext = createContext();

// Провайдер контекста
export const ImageLoadProvider = ({ children }) => {
  const [totalImages, setTotalImages] = useState(0);
  const [loadedImages, setLoadedImages] = useState(0);

  const registerImage = () => {
    setTotalImages((prevTotal) => prevTotal + 1);
  };

  const handleImageLoad = () => {
    setLoadedImages((prevLoaded) => prevLoaded + 1);
  };

  const allImagesLoaded = loadedImages === totalImages && totalImages > 0;

  return (
    <ImageLoadContext.Provider
      value={{ registerImage, handleImageLoad, allImagesLoaded }}
    >
      {children}
    </ImageLoadContext.Provider>
  );
};
