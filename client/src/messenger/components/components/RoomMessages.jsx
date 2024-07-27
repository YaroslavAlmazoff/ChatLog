import { useEffect, useRef } from "react";
import RoomMessage from "./RoomMessage";

export default function RoomMessages({ messages }) {
  const messagesListRef = useRef(null);

  useEffect(() => {
    if (messagesListRef.current) {
      setTimeout(() => {
        messagesListRef.current.scrollTop =
          messagesListRef.current.scrollHeight;
      }, 10); // Добавьте небольшую задержку
    }
  }, [messages]);

  return (
    <div className="room-messages" ref={messagesListRef}>
      {messages.map((message) => (
        <RoomMessage message={message} />
      ))}
    </div>
  );
}
