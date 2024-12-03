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
import useLoad from "../../hooks/useLoad";
import useAudio from "../../hooks/useAudio";
import { messagesDataTypes } from "../../data/messengerConfiguration";
import { AuthContext } from "../../../context/AuthContext";
import { ImageLoadContext } from "../../context/ImageLoadContext";
import messageSound from "../../audio/message.mp3";
import "../../styles/global.css";
import useScroll from "../../hooks/useScroll";

export default function Room() {
  const params = useParams();
  const { getRoom, createEventSource, getMessages, read } = useAPI();
  const { fileFromServer } = useFile();
  const { playAudio } = useAudio(messageSound);
  const { loadScroll, scrollToBottom } = useScroll();
  const { userId } = useContext(AuthContext);

  const feedRef = useRef(null);
  const currentHeight = useRef(0);

  const [room, setRoom] = useState({ name: "", date: "", bg: "" });
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [actionType, setActionType] = useState(messagesDataTypes.init);
  const [firstLoading, setFirstLoading] = useState(true);

  const setErrorCallback = useCallback((err) => {
    setError(err);
  }, []);

  const id = useMemo(() => params.id, [params]);

  const { register, load } = useLoad(() => {
    console.log("callback", actionType, page);
    if (!feedRef.current) return;
    if (
      actionType === messagesDataTypes.init ||
      actionType === messagesDataTypes.create ||
      (actionType === messagesDataTypes.load && page < 3)
    ) {
      console.log("scroll to bottom");
      scrollToBottom(feedRef);
    } else if (actionType === messagesDataTypes.load) {
      console.log(feedRef, currentHeight.current);
      loadScroll(feedRef, currentHeight.current);
    }
    if (!firstLoading) {
      setMessages((prev) =>
        prev.map((message) => {
          message.isNew = false;
          return message;
        })
      );
    } else if (actionType === messagesDataTypes.load) {
      setFirstLoading(false);
    }
  });

  useEffect(() => {
    const getDataAndStartEventSource = async () => {
      const { room } = await getRoom(id);
      setRoom(room);

      const eventSource = createEventSource(id);
      eventSource.onmessage = function (event) {
        const messagesData = JSON.parse(event.data);
        const newMessages = messagesData.messages;
        const isInit = messagesData.type === messagesDataTypes.init;
        const isLoad = messagesData.type === messagesDataTypes.load;
        const isCreate = messagesData.type === messagesDataTypes.create;
        const isDelete = messagesData.type === messagesDataTypes.delete;
        const isMyAction = messagesData.user === userId;

        console.log("DATA");

        setActionType(messagesData.type);

        currentHeight.current = feedRef.current.scrollHeight;

        if (isInit) {
          read(newMessages, id);
        }

        if (isCreate) {
          newMessages[0].isJustSent = true;
          newMessages[0].isNew = true;
          setMessages((prev) => [...prev, ...newMessages]);
          if (isMyAction) {
            setLoading(false);
          } else {
            playAudio();
          }
        } else if (isDelete) {
          setMessages((prev) =>
            prev.filter((message) => message._id !== newMessages[0]._id)
          );
          setOffset((prev) => prev - 1);
        } else if ((isInit || isLoad) && isMyAction) {
          const newMessagesWithNewFlag = newMessages.map((message) => {
            message.isNew = true;
            return message;
          });
          setMessages((prev) => [...newMessagesWithNewFlag, ...prev]);
          setLoading(false);
        }
      };
    };
    getDataAndStartEventSource();
  }, [createEventSource, getRoom, playAudio, id, userId]);

  useEffect(() => {
    if (page !== 1) {
      getMessages(page, offset);
    }
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
      <ImageLoadContext.Provider value={{ register, load }}>
        <RoomMessages
          messages={messages}
          ref={feedRef}
          loading={loading}
          setPage={setPage}
        />
      </ImageLoadContext.Provider>
      <RoomMainField
        setOffset={setOffset}
        error={error}
        setErrorCallback={setErrorCallback}
      />
    </div>
  );
}
