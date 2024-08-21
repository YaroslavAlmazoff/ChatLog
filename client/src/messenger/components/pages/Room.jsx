import { useEffect, useState, useRef, useMemo, useContext } from "react";
import { useParams } from "react-router";
import RoomHead from "../components/RoomHead";
import RoomMessageField from "../components/RoomMessageField";
import RoomMessages from "../components/RoomMessages";
import useAPI from "../../hooks/useAPI";
import useFile from "../../hooks/useFile";
import { messagesDataTypes } from "../../data/messengerConfiguration";
import "../../styles/Room.css";
import { AuthContext } from "../../../context/AuthContext";

export default function Room() {
  const params = useParams();
  const { getRoom, createEventSource, getMessages } = useAPI();
  const { fileFromServer } = useFile();
  const { userId } = useContext(AuthContext);

  const feedRef = useRef(null);

  const [room, setRoom] = useState({ name: "", date: "", bg: "" });
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);

  const id = useMemo(() => params.id, [params]);

  useEffect(() => {
    const getData = async () => {
      const { room } = await getRoom(id);
      setRoom(room);
    };
    const startEventSource = () => {
      const eventSource = createEventSource(id);
      eventSource.onmessage = function (event) {
        const messagesData = JSON.parse(event.data);
        const newMessages = messagesData.messages;
        const currentHeight = feedRef.current.scrollHeight;

        console.log(newMessages);

        const isInit = messagesData.type === messagesDataTypes.init;
        const isCreate = messagesData.type === messagesDataTypes.create;
        const isLoad = messagesData.type === messagesDataTypes.load;

        const isMyMessage = messagesData.user === userId;

        if (isCreate) {
          setMessages((prev) => [...prev, ...newMessages]);
        } else if ((isInit || isLoad) && isMyMessage) {
          setMessages((prev) => [...newMessages, ...prev]);

          if (isLoad && feedRef.current) {
            setTimeout(() => {
              feedRef.current.scrollTop =
                feedRef.current.scrollHeight - currentHeight;
            }, 0);
          }

          setLoading(false);
        }

        if ((!isLoad && isMyMessage) || isCreate) {
          feedRef.current.scrollTop = feedRef.current.scrollHeight;
        }

        if (isCreate && isMyMessage) {
          setLoading(false);
        }
      };
    };

    getData();
    startEventSource();
  }, [createEventSource, getRoom, id, userId]);

  useEffect(() => {
    getMessages(page, offset);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, getMessages]);

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
        ref={feedRef}
        loading={loading}
        setPage={setPage}
      />
      <RoomMessageField setOffset={setOffset} />
    </div>
  );
}
