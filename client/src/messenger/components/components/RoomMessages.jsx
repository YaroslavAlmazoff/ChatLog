import { useEffect, useRef } from "react";
import ScrollableFeed from "react-scrollable-feed";
import RoomMessage from "./RoomMessage";

export default function RoomMessages({ messages }) {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="room-messages">
      <ScrollableFeed>
        {messages.map((message) => (
          <RoomMessage message={message} />
        ))}
      </ScrollableFeed>
    </div>
  );
}
