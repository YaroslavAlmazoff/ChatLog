import { useEffect, useRef, useState } from "react";
import RoomMessage from "./RoomMessage";

export default function RoomMessages({ messages }) {
  const messagesListRef = useRef(null);

  const [scrollState, setScrollState] = useState(false);

  useEffect(() => {
    if (messagesListRef.current) {
      console.log(
        messagesListRef.current.scrollTop,
        messagesListRef.current.scrollHeight
      );
      messagesListRef.current.scrollTo(0, messagesListRef.current.scrollHeight);
      messagesListRef.current.scrollTop = messagesListRef.current.scrollHeight;
      console.log(
        messagesListRef.current.scrollTop,
        messagesListRef.current.scrollHeight
      );
      setScrollState(true);
    }
  }, [messages]);

  return (
    <>
      {scrollState && (
        <div className="room-messages" ref={messagesListRef}>
          {messages.map((message) => (
            <RoomMessage message={message} />
          ))}
        </div>
      )}
    </>
  );
}
