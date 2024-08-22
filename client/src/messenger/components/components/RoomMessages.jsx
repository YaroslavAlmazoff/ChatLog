import { useRef, forwardRef, useEffect } from "react";
import RoomMessage from "./RoomMessage";
import { useObserver } from "../../../common_hooks/observer.hook";
import {
  ImageLoadProvider,
  useImageLoad,
} from "../../context/ImageLoadContext";

export default forwardRef(function RoomMessages(
  { messages, loading, setPage },
  ref
) {
  const messagesEndRef = useRef(null);
  const { allImagesLoaded } = useImageLoad();

  useObserver(messagesEndRef, true, loading, () => {
    setPage((prev) => prev + 1);
  });

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
        <ImageLoadProvider>
          {messages.map((message) => (
            <RoomMessage message={message} />
          ))}
        </ImageLoadProvider>
      </div>
    </div>
  );
});
