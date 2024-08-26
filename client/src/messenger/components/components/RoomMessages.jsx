import { useRef, forwardRef } from "react";
import RoomMessage from "./RoomMessage/RoomMessage";
import { useObserver } from "../../../common_hooks/observer.hook";
import { ImageLoadContext } from "../../context/ImageLoadContext";

export default forwardRef(function RoomMessages(
  { messages, loading, setPage },
  ref
) {
  const messagesEndRef = useRef(null);

  useObserver(messagesEndRef, true, loading, () => {
    setPage((prev) => prev + 1);
  });

  return (
    <div className="room-messages-wrapper">
      <div className="room-messages" ref={ref}>
        <div
          ref={messagesEndRef}
          style={{ height: "10px", backgroundColor: "#40a4ff" }}
        />

        {messages.map((message) => (
          <RoomMessage message={message} />
        ))}
      </div>
    </div>
  );
});
