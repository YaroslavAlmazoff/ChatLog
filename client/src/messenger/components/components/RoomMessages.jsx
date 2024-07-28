import { useState, useEffect, useRef } from "react";
import ScrollableFeed from "react-scrollable-feed";
import RoomMessage from "./RoomMessage";

export default function RoomMessages({ messages }) {
  const messagesRef = useRef(null);

  const [atTop, setAtTop] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      if (messagesRef.current) {
        const isAtTop = messagesRef.current.scrollTop === 0;
        setAtTop(isAtTop);
        console.log("at the top");
      }
    };

    if (messagesRef.current) {
      messagesRef.current.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (messagesRef.current) {
        messagesRef.current.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  return (
    <div className="room-messages-wrapper">
      <ScrollableFeed
        className="room-messages"
        forceScroll={true}
        ref={messagesRef}
      >
        {messages.map((message) => (
          <RoomMessage message={message} />
        ))}
      </ScrollableFeed>
    </div>
  );
}
