import { useRef, useState, useEffect } from "react";
import RoomMessage from "./RoomMessage";

export default function RoomMessages({ messages }) {
  const messagesListRef = useRef(null);
  const [scrollBottom, setScrollBottom] = useState(false);

  useEffect(() => {
    if (scrollBottom && messagesListRef.current) {
      messagesListRef.current.scrollTop = messagesListRef.current.scrollHeight;
      setScrollBottom(false);
    }
  }, [messages, scrollBottom]);

  useEffect(() => {
    const handleResize = () => {
      setScrollBottom(true);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="room-messages" ref={messagesListRef}>
      {messages.map((message) => (
        <RoomMessage message={message} />
      ))}
    </div>
  );
}
