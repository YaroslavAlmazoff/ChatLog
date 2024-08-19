import { useState, useRef, forwardRef } from "react";
import { useObserver } from "../../../common_hooks/observer.hook";
import RoomMessage from "./RoomMessage";
import useAPI from "../../hooks/useAPI";

export default forwardRef(function RoomMessages(
  { messages, setMessages, offset, loading, canChangeVisibility },
  ref
) {
  const { getMessages } = useAPI();

  const messagesEndRef = useRef(null);

  const [page, setPage] = useState(1);

  useObserver(messagesEndRef, true, loading, () => {
    console.log(loading);
    getMessages(page, offset);
    setPage((prev) => prev++);
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
