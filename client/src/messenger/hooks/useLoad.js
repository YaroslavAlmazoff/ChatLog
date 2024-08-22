import { useState } from "react";

export default function useLoad() {
  const [totalImages, setTotalImages] = useState(0);
  const [loadedImages, setLoadedImages] = useState(0);

  const registerImage = () => {
    console.log("Image registered");
    setTotalImages((prevTotal) => prevTotal + 1);
  };

  const handleImageLoad = () => {
    console.log("Image loaded");
    setLoadedImages((prevLoaded) => prevLoaded + 1);
  };

  const allImagesLoaded = totalImages === 0 || loadedImages === totalImages;
  return { allImagesLoaded, registerImage, handleImageLoad };
}
