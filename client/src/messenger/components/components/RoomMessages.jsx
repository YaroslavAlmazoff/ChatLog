import { useRef, forwardRef, useEffect, useState } from "react";
import RoomMessage from "./RoomMessage";
import { useObserver } from "../../../common_hooks/observer.hook";
import { ImageLoadContext } from "../../context/ImageLoadContext";

export default forwardRef(function RoomMessages(
  { messages, loading, setPage },
  ref
) {
  const messagesEndRef = useRef(null);

  const [totalImages, setTotalImages] = useState(0);
  const [loadedImages, setLoadedImages] = useState(0);

  useObserver(messagesEndRef, true, loading, () => {
    setPage((prev) => prev + 1);
  });

  const registerImage = () => {
    setTotalImages((prevTotal) => prevTotal + 1);
  };

  const handleImageLoad = () => {
    setLoadedImages((prevLoaded) => prevLoaded + 1);
  };

  const allImagesLoaded = totalImages === 0 || loadedImages === totalImages;

  useEffect(() => {
    ref.current.scrollTop = ref.current.scrollHeight;
  }, [allImagesLoaded, ref]);

  return (
    <div className="room-messages-wrapper">
      <div className="room-messages" ref={ref}>
        <div
          ref={messagesEndRef}
          style={{ height: "10px", backgroundColor: "#40a4ff" }}
        />
        <ImageLoadContext.Provider value={{ registerImage, handleImageLoad }}>
          {messages.map((message) => (
            <RoomMessage message={message} />
          ))}
        </ImageLoadContext.Provider>
      </div>
    </div>
  );
});
