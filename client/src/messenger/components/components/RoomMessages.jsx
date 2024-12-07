import { useRef, forwardRef } from "react";
import RoomMessage from "./RoomMessage/RoomMessage";
import { useObserver } from "../../../common_hooks/observer.hook";
import Loader from "../../../common_components/Loader";
import RoomNoMessages from "./RoomNoMessages";

export default forwardRef(function RoomMessages(
  {
    messages,
    startLoading,
    observerLoading,
    sendLoading,
    scrollLoading,
    setPage,
  },
  ref
) {
  const messagesEndRef = useRef(null);

  useObserver(messagesEndRef, true, observerLoading, () => {
    setPage((prev) => prev + 1);
  });

  return (
    <div className="room-messages-wrapper">
      <div className="room-messages" ref={ref}>
        <div
          ref={messagesEndRef}
          style={{ height: "10px", backgroundColor: "#40a4ff" }}
        />

        {scrollLoading ? <Loader /> : <></>}

        {!startLoading ? (
          messages.map((message, index) => (
            <RoomMessage
              message={message}
              index={index}
              key={`${message.message}${message.date}-${index}`}
            />
          ))
        ) : (
          <Loader />
        )}

        {sendLoading ? <Loader /> : <></>}

        {!observerLoading && !messages.length ? <RoomNoMessages /> : <></>}
      </div>
    </div>
  );
});
