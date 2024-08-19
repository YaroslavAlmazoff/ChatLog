import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router";
import RoomHead from "../components/RoomHead";
import RoomMessageField from "../components/RoomMessageField";
import RoomMessages from "../components/RoomMessages";
import useAPI from "../../hooks/useAPI";
import useFile from "../../hooks/useFile";
import { messagesDataTypes } from "../../data/messengerConfiguration";
import "../../styles/Room.css";

export default function Room() {
  const { id } = useParams();
  const { getRoom, createEventSource } = useAPI();
  const { fileFromServer } = useFile();

  const feedRef = useRef(null);

  const [room, setRoom] = useState({ name: "", date: "", bg: "" });
  const [messages, setMessages] = useState([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);

  const [canChangeVisibility, setCanChangeVisibility] = useState(true);

  const anchorElement = useRef(null);

  const getRectAndAnchorValue = (messagesData) => {
    if (!messagesData.type === messagesDataTypes.init) {
      let anchor = null;
      let isBegin = messagesData.messages.length;

      if (!anchorElement.current) {
        anchor = document.querySelector(
          `#message-${messages[messages.length - 1]._id}`
        );
      } else {
        anchor = anchorElement.current;
      }

      const rect = anchor.getBoundingClientRect();
      return { rect, anchorValue: isBegin ? rect.bottom : rect.top };
    } else {
      return { rect: { top: 0, bottom: 0 }, anchorValue: 0 };
    }
  };

  useEffect(() => {
    const getData = async () => {
      const { room } = await getRoom(id);
      setRoom(room);
    };
    const startEventSource = () => {
      const eventSource = createEventSource(id);
      eventSource.onmessage = function (event) {
        const messagesData = JSON.parse(event.data);

        setCanChangeVisibility(false);

        const { rect, anchorValue } = getRectAndAnchorValue(messagesData);

        setMessages((prev) => [...messagesData.messages, ...prev]);
        if (
          messagesData.type === messagesDataTypes.init ||
          messagesData.type === messagesDataTypes.create
        ) {
          feedRef.current.scrollTop = feedRef.current.scrollHeight;
        } else {
          requestAnimationFrame(() => {
            const newAnchorTop = rect.top;
            if (anchorValue && newAnchorTop) {
              feedRef.current.scrollTop = newAnchorTop - anchorValue;
            }
          });
        }
        setLoading(false);
      };
    };

    getData();
    startEventSource();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setCanChangeVisibility(true);
    console.log(messages.toReversed());
    messages.toReversed().forEach((item) => {
      if (item.isVisible) {
        console.log(item.isVisible);
        anchorElement.current = document.querySelector(`#message-${item._id}`);
      }
    });

    console.log("Anchor element: ", anchorElement);
  }, [messages]);

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
        setMessages={setMessages}
        offset={offset}
        ref={feedRef}
        loading={loading}
        canChangeVisibility={canChangeVisibility}
      />
      <RoomMessageField setOffset={setOffset} />
    </div>
  );
}
