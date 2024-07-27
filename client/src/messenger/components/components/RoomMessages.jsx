import { useEffect, useRef } from "react";
import RoomMessage from "./RoomMessage";

export default function RoomMessages({ messages }) {
  const messagesListRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="room-messages" ref={messagesListRef}>
      {messages.map((message) => (
        <RoomMessage message={message} />
      ))}
      <div style={{ height: "1px" }} ref={messagesEndRef}></div>
    </div>
  );
}
