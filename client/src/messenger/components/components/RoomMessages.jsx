import { useState, useEffect, useRef } from "react";
import ScrollableFeed from "react-scrollable-feed";
import { useObserver } from "../../../common_hooks/observer.hook";
import RoomMessage from "./RoomMessage";

export default function RoomMessages({ messages }) {
  const messagesEndRef = useRef(null);

  const [state, setState] = useState(null);

  useObserver(messagesEndRef, true, false, () => {
    console.log("афигеть, работает!!!");
    setState(1);
  });

  return (
    <div className="room-messages-wrapper">
      <ScrollableFeed className="room-messages" forceScroll={true}>
        <div
          ref={messagesEndRef}
          style={{ height: "10px", backgroundColor: "#40a4ff" }}
        />
        {messages.map((message) => (
          <RoomMessage message={message} />
        ))}
      </ScrollableFeed>
    </div>
  );
}
