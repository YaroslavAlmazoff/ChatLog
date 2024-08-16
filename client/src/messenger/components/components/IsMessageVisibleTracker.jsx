import React, { useEffect, useRef } from "react";

export default function IsVisibleMessageTracker({
  setMessages,
  message,
  children,
}) {
  const messageRef = useRef(null);

  useEffect(() => {
    const onVisibilityChange = (isVisible) => {
      setMessages((prev) => {
        const messages = [...prev];
        const index = messages.findIndex((item) => item._id === message._id);
        messages[index] = { ...message[index], isVisible };
        return messages;
      });
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          onVisibilityChange(true);
        } else {
          onVisibilityChange(false);
        }
      });
    });

    if (messageRef.current) {
      observer.observe(messageRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [setMessages, message]);

  return (
    <div
      ref={messageRef}
      style={{ minHeight: "50px" }}
      id={`message-${message._id}`}
    >
      {children}
    </div>
  );
}
