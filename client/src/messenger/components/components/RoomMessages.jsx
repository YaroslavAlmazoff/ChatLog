import { useRef, forwardRef, useContext, useEffect } from "react";
import RoomMessage from "./RoomMessage/RoomMessage";
import { useObserver } from "../../../common_hooks/observer.hook";
import { ImageLoadContext } from "../../context/ImageLoadContext";
import { messagesDataTypes } from "../../data/messengerConfiguration";
import useScroll from "../../hooks/useScroll";

export default forwardRef(function RoomMessages(
  { messages, loading, setPage, actionType },
  ref
) {
  const messagesEndRef = useRef(null);

  const { allMessagesLoaded } = useContext(ImageLoadContext);
  const { scrollToBottom } = useScroll();

  useObserver(messagesEndRef, true, loading, () => {
    setPage((prev) => prev + 1);
  });

  useEffect(() => {
    console.log("здесь");
    if (actionType === messagesDataTypes.init) {
      scrollToBottom(ref);
    }
  }, [allMessagesLoaded]);

  return (
    <div className="room-messages-wrapper">
      <div className="room-messages" ref={ref}>
        <div
          ref={messagesEndRef}
          style={{ height: "10px", backgroundColor: "#40a4ff" }}
        />

        {messages.map((message, index) => (
          <RoomMessage
            message={message}
            index={index}
            key={`${message.message}${message.date}-${index}`}
          />
        ))}
      </div>
    </div>
  );
});
