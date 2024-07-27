import { useEffect, useRef } from "react";
import ScrollableFeed from "react-scrollable-feed";
import RoomMessage from "./RoomMessage";

export default function RoomMessages({ messages }) {
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
