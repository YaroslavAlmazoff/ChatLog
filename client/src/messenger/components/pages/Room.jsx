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
import { folders, messagesDataTypes } from "../../data/messengerConfiguration";
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
  const [scrollLoading, setScrollLoading] = useState(false);
  const [error, setError] = useState(false);
  const [actionType, setActionType] = useState(messagesDataTypes.init);

  const setErrorCallback = useCallback((err) => {
    setError(err);
  }, []);

  const id = useMemo(() => params.id, [params]);

  const { register, load } = useLoad(() => {
    console.log("callback", actionType, page);
    if (!feedRef.current) return;
    if (
      actionType === messagesDataTypes.init ||
      actionType === messagesDataTypes.create
    ) {
      console.log("scroll to bottom");
      scrollToBottom(feedRef);
    } else if (actionType === messagesDataTypes.load) {
      console.log(
        "старая высота: " + currentHeight.current,
        "новая высота: " + feedRef.current.scrollHeight
      );
      loadScroll(feedRef, currentHeight.current);
    }
    setScrollLoading(false);
  });

  const makeMessageOld = (message) => {
    setMessages((prev) => {
      return prev.map((item) =>
        item._id === message._id ? { ...item, isNew: false } : item
      );
    });
  };

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

        setActionType(messagesData.type);

        currentHeight.current = feedRef.current.scrollHeight;
        console.log(
          "save height: " +
            feedRef.current.scrollHeight +
            " " +
            currentHeight.current
        );

        if (isInit) {
          read(newMessages, id);
        }

        if (isMyAction) setLoading(false);

        if (isCreate) {
          newMessages[0].isJustSent = true;
          newMessages[0].isNew = true;
          setMessages((prev) => [...prev, ...newMessages]);
          if (!isMyAction) {
            playAudio();
          }
        } else if (isDelete) {
          setMessages((prev) =>
            prev.filter((message) => message._id !== newMessages[0]._id)
          );
          setOffset((prev) => prev - 1);
        } else if ((isInit || isLoad) && isMyAction) {
          const newMessagesWithNewFlag = newMessages.map((message) => ({
            ...message,
            isNew: true,
          }));
          newMessagesWithNewFlag.forEach((item) => {
            console.log("register ", item.message);
            register();
          });
          setMessages((prev) => [...newMessagesWithNewFlag, ...prev]);
        }
      };
    };
    getDataAndStartEventSource();
  }, [createEventSource, getRoom, playAudio, id, userId]);

  useEffect(() => {
    if (page !== 1) {
      setScrollLoading(true);
      getMessages(page, offset);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, getMessages]);

  useEffect(() => {
    console.log(messages);
  }, [messages]);

  return (
    <div
      className="block room-size room"
      style={{
        backgroundImage: room.bg
          ? `url(${fileFromServer(folders.bg, room.bg)})`
          : "",
      }}
    >
      <RoomHead
        name={room.name}
        onlineDate={room.date}
        isOnline={room.isOnline}
      />
      <ImageLoadContext.Provider value={{ register, load, makeMessageOld }}>
        <RoomMessages
          messages={messages}
          ref={feedRef}
          loading={loading}
          scrollLoading={scrollLoading}
          setPage={setPage}
        />
      </ImageLoadContext.Provider>
      <RoomMainField
        setRoom={setRoom}
        setOffset={setOffset}
        error={error}
        setErrorCallback={setErrorCallback}
        setLoading={setLoading}
      />
    </div>
  );
}
