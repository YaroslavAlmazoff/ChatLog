import { useEffect, useState, useRef, useMemo, useContext } from "react";
import { useParams } from "react-router";
import RoomHead from "../components/RoomHead";
import RoomMessageField from "../components/RoomMessageField";
import RoomMessages from "../components/RoomMessages";
import useAPI from "../../hooks/useAPI";
import useFile from "../../hooks/useFile";
import useAudio from "../../hooks/useAudio";
import { messagesDataTypes } from "../../data/messengerConfiguration";
import { AuthContext } from "../../../context/AuthContext";
import messageSound from "../../audio/message.mp3";
import "../../styles/Room.css";

export default function Room() {
  const params = useParams();
  const { getRoom, createEventSource, getMessages } = useAPI();
  const { fileFromServer } = useFile();
  const { playAudio } = useAudio(messageSound);
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
        console.log(" едрить его в корень ", userId);

        const messagesData = JSON.parse(event.data);
        const newMessages = messagesData.messages;
        const currentHeight = feedRef.current.scrollHeight;
        const isInit = messagesData.type === messagesDataTypes.init;
        const isCreate = messagesData.type === messagesDataTypes.create;
        const isLoad = messagesData.type === messagesDataTypes.load;
        const isMyAction = messagesData.user === userId;

        console.log(newMessages);

        console.log(
          isCreate,
          isInit,
          isLoad,
          isInit || isLoad,
          isMyAction,
          (isInit || isLoad) && isMyAction,
          messagesData.user
        );

        if (isCreate) {
          setMessages((prev) => [...prev, ...newMessages]);
          if (isCreate && !isMyAction) playAudio();
        } else if ((isInit || isLoad) && isMyAction) {
          setMessages((prev) => [...newMessages, ...prev]);

          if (isLoad && feedRef.current) {
            setTimeout(() => {
              feedRef.current.scrollTop =
                feedRef.current.scrollHeight - currentHeight;
            }, 0);
          }

          setLoading(false);
        }
        if ((!isLoad && isMyAction) || isCreate) {
          feedRef.current.scrollTop = feedRef.current.scrollHeight;
        }
        if (isCreate && isMyAction) {
          setLoading(false);
        }
      };
    };
    getData();
    startEventSource();
  }, [createEventSource, getRoom, playAudio, id, userId]);

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
        page={page}
        setPage={setPage}
      />
      <RoomMessageField setOffset={setOffset} />
    </div>
  );
}
