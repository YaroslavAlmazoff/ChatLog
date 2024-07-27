import { useEffect, useRef } from "react";
import ScrollableFeed from "react-scrollable-feed";
import RoomMessage from "./RoomMessage";

export default function RoomMessages({ messages }) {
  return (
    <ScrollableFeed className="room-messages" forceScroll={true}>
      {messages.map((message) => (
        <RoomMessage message={message} />
      ))}
    </ScrollableFeed>
  );
}
