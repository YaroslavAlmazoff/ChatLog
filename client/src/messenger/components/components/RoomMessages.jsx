import { useEffect, useRef } from "react";
import RoomMessage from "./RoomMessage";

export default function RoomMessages({ messages }) {
  const messagesListRef = useRef();

  useEffect(() => {
    messagesListRef.current.scrollTop = messagesListRef.current.scrollHeight;
  }, [messages]);

  return (
    <div className="room-messages" ref={messagesListRef}>
      {messages.map((message) => (
        <RoomMessage message={message} />
      ))}
    </div>
  );
}
