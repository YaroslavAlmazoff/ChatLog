import { useState, useEffect, useRef } from "react";
import ScrollableFeed from "react-scrollable-feed";
import { useIntersectionObserver } from "react-intersection-observer";
import RoomMessage from "./RoomMessage";

export default function RoomMessages({ messages }) {
  const { ref, isIntersecting } = useIntersectionObserver({
    threshold: 0.5,
    rootMargin: "0px 0px -50% 0px",
  });

  if (isIntersecting) {
    console.log("ScrollableFeed прокручен в начало!");
  }

  return (
    <div className="room-messages-wrapper">
      <ScrollableFeed className="room-messages" forceScroll={true} ref={ref}>
        {messages.map((message) => (
          <RoomMessage message={message} />
        ))}
      </ScrollableFeed>
    </div>
  );
}
