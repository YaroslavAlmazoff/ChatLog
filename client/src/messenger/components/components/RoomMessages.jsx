import { useRef, forwardRef, useEffect } from "react";
import RoomMessage from "./RoomMessage/RoomMessage";
import { useObserver } from "../../../common_hooks/observer.hook";
import { ImageLoadContext } from "../../context/ImageLoadContext";
import useLoad from "../../hooks/useLoad";

export default forwardRef(function RoomMessages(
  { messages, loading, page, setPage },
  ref
) {
  const messagesEndRef = useRef(null);
  const { allMediaLoaded, registerMedia, handleMediaLoad } = useLoad();

  useObserver(messagesEndRef, true, loading, () => {
    setPage((prev) => prev + 1);
  });

  useEffect(() => {
    if (allMediaLoaded && page === 1) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [allMediaLoaded, page, ref]);

  return (
    <div className="room-messages-wrapper">
      <div className="room-messages" ref={ref}>
        <div
          ref={messagesEndRef}
          style={{ height: "10px", backgroundColor: "#40a4ff" }}
        />
        <ImageLoadContext.Provider value={{ registerMedia, handleMediaLoad }}>
          {messages.map((message) => (
            <RoomMessage message={message} />
          ))}
        </ImageLoadContext.Provider>
      </div>
    </div>
  );
});
