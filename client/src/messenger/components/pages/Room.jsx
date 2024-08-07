import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router";
import RoomHead from "../components/RoomHead";
import RoomMessageField from "../components/RoomMessageField";
import RoomMessages from "../components/RoomMessages";
import useAPI from "../../hooks/useAPI";
import useFile from "../../hooks/useFile";
import {
  testMessages,
  messagesDataTypes,
} from "../../data/messengerConfiguration";
import "../../styles/Room.css";

export default function Room() {
  const { id } = useParams();
  const { getRoom, createEventSource } = useAPI();
  const { fileFromServer } = useFile();

  const feedRef = useRef(null);

  const [room, setRoom] = useState({ name: "", date: "", bg: "" });
  const [messages, setMessages] = useState(testMessages);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      const { room } = await getRoom(id);
      setRoom(room);
    };
    const startEventSource = () => {
      const eventSource = createEventSource(id);
      eventSource.onmessage = function (event) {
        const messagesData = JSON.parse(event.data);

        const anchorElement = document.querySelector(
          ".your-message-classname:first-child"
        );
        const anchorTop = anchorElement?.getBoundingClientRect().top;

        setMessages((prev) => [...messagesData.messages, ...prev]);
        console.log(messagesData.messages, messagesData.type);
        if (
          messagesData.type === messagesDataTypes.init ||
          messagesData.type === messagesDataTypes.create
        ) {
          //feedRef.current.scrollToBottom();

          requestAnimationFrame(() => {
            const newAnchorTop = anchorElement?.getBoundingClientRect().top;
            if (anchorTop && newAnchorTop) {
              feedRef.current.scrollTop = newAnchorTop - anchorTop;
            }
          });
        } else {
          feedRef.current.scrollTop = feedRef.current.scrollHeight;
        }
        setLoading(false);
      };
    };

    getData();
    startEventSource();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="block room-size room"
      style={{
        backgroundImage: room.bg ? `url(${fileFromServer(room.bg)})` : "",
      }}
    >
      <RoomHead
        name={room.name}
        onlineDate={room.date}
        isOnline={room.isOnline}
      />
      <RoomMessages
        messages={messages}
        offset={offset}
        ref={feedRef}
        loading={loading}
      />
      <RoomMessageField setOffset={setOffset} />
    </div>
  );
}
