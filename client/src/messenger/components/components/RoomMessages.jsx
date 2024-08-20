import { useRef, forwardRef } from "react";
import { useObserver } from "../../../common_hooks/observer.hook";
import RoomMessage from "./RoomMessage";
import useAPI from "../../hooks/useAPI";

export default forwardRef(function RoomMessages(
  { messages, offset, loading, page, setPage },
  ref
) {
  const { getMessages } = useAPI();

  const messagesEndRef = useRef(null);

  useObserver(messagesEndRef, true, loading, () => {
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
