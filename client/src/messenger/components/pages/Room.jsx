import {
  useEffect,
  useState,
  useRef,
  useMemo,
  useContext,
  useCallback,
} from "react";
import { useParams } from "react-router";
import RoomHead from "../components/RoomHead";
import RoomMainField from "../components/RoomMainField";
import RoomMessages from "../components/RoomMessages";
import useAPI from "../../hooks/useAPI";
import useFile from "../../hooks/useFile";
import useAudio from "../../hooks/useAudio";
import { messagesDataTypes } from "../../data/messengerConfiguration";
import { AuthContext } from "../../../context/AuthContext";
import messageSound from "../../audio/message.mp3";
import "../../styles/global.css";

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
  const [error, setError] = useState(false);
  const [actionType, setActionType] = useState(messagesDataTypes.init);

  const currentHeight = useRef(0);

  const setErrorCallback = useCallback((err) => {
    setError(err);
  }, []);

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
        const currentScrollHeight = feedRef.current.scrollHeight;
        const isInit = messagesData.type === messagesDataTypes.init;
        const isLoad = messagesData.type === messagesDataTypes.load;
        const isCreate = messagesData.type === messagesDataTypes.create;
        const isDelete = messagesData.type === messagesDataTypes.delete;
        const isMyAction = messagesData.user === userId;

        setActionType(messagesData.type);

        currentHeight.current = feedRef.current.scrollHeight;

        if (isCreate) {
          setMessages((prev) => [...prev, ...newMessages]);
          if (isCreate && !isMyAction) playAudio();
        } else if (isDelete) {
          setMessages((prev) =>
            prev.filter((message) => message._id !== newMessages[0]._id)
          );
          setOffset((prev) => prev - 1);
        } else if ((isInit || isLoad) && isMyAction) {
          setMessages((prev) => [...newMessages, ...prev]);
          if (isLoad && feedRef.current) {
            setTimeout(() => {
              feedRef.current.scrollTop =
                feedRef.current.scrollHeight - currentScrollHeight;
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

  // useEffect(() => {
  //   if (actionType === messagesDataTypes.load && feedRef.current) {
  //     setTimeout(() => {
  //       feedRef.current.scrollTop =
  //         feedRef.current.scrollHeight - currentHeight.current;
  //     }, 0);
  //   }
  // }, [messages]);

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
      <RoomMainField
        setOffset={setOffset}
        error={error}
        setErrorCallback={setErrorCallback}
      />
    </div>
  );
}
