import { useState, useRef, forwardRef } from "react";
import ScrollableFeed from "react-scrollable-feed";
import { useObserver } from "../../../common_hooks/observer.hook";
import RoomMessage from "./RoomMessage";
import useAPI from "../../hooks/useAPI";

export default forwardRef(function RoomMessages(
  { messages, offset, loading },
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
      <ScrollableFeed ref={ref} className="room-messages">
        <div
          ref={messagesEndRef}
          style={{ height: "10px", backgroundColor: "#40a4ff" }}
        />
        {messages.map((message) => (
          <RoomMessage message={message} />
        ))}
      </ScrollableFeed>
    </div>
  );
});
