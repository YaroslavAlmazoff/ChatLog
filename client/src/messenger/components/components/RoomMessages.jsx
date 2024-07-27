import { useEffect, useRef } from "react";
import RoomMessage from "./RoomMessage";

export default function RoomMessages({ messages }) {
  const messagesListRef = useRef(null);

  useEffect(() => {
    if (messagesListRef.current) {
      messagesListRef.current.scrollTo(0, messagesListRef.current.scrollHeight);
    }
  }, []);

  return (
    <div className="room-messages" ref={messagesListRef}>
      {messages.map((message) => (
        <RoomMessage message={message} />
      ))}
    </div>
  );
}
