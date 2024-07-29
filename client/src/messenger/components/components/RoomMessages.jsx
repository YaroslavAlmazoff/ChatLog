import { useState, useEffect, useRef } from "react";
import ScrollableFeed from "react-scrollable-feed";
import { useObserver } from "../../../common_hooks/observer.hook";
import RoomMessage from "./RoomMessage";
import useAPI from "../../hooks/useAPI";
import { useParams } from "react-router";

export default function RoomMessages({ messages, offset }) {
  const { id } = useParams();
  const { getMessages } = useAPI();

  const messagesEndRef = useRef(null);

  const [page, setPage] = useState(1);

  useObserver(messagesEndRef, true, false, () => {
    console.log("афигеть, работает!!!");
    setPage((prev) => prev++);
  });

  useEffect(() => {
    getMessages(id, page, offset);
  }, [page]);

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
