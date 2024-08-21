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
  const [page, setPage] = useState(1);
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
        const currentHeight = feedRef.current.scrollHeight;

        console.log(page);

        setMessages((prev) => [...messagesData.messages, ...prev]);

        setTimeout(() => {
          feedRef.current.scrollTop =
            feedRef.current.scrollHeight - currentHeight;
        }, 0);
        if (
          messagesData.type === messagesDataTypes.init ||
          messagesData.type === messagesDataTypes.create
        ) {
          feedRef.current.scrollTop = feedRef.current.scrollHeight;
        }
        setLoading(false);
        setPage(2);
      };
    };

    getData();
    startEventSource();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    console.log(page);
  }, [page]);

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
        page={page}
      />
      <RoomMessageField setOffset={setOffset} />
    </div>
  );
}
