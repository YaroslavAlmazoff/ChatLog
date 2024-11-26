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
import useMessage from "../../hooks/useMessage";
import useScroll from "../../hooks/useScroll";

export default function Room() {
  const params = useParams();
  const { getRoom, createEventSource, getMessages } = useAPI();
  const { fileFromServer } = useFile();
  const { playAudio } = useAudio(messageSound);
  const { getMediaExists } = useMessage();
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

  const firstLoad = useRef(true);

  const setErrorCallback = useCallback((err) => {
    setError(err);
  }, []);

  const id = useMemo(() => params.id, [params]);

  const {
    registerMedia,
    loadMedia,
    setJustSentMediaLoaded,
    justSentMediaLoaded,
    allMediaLoaded,
  } = useLoad((totalMediaHeight) => {
    console.log("callback", actionType);
    if (!feedRef.current) return;
    console.log("actionType", actionType);
    if (
      actionType === messagesDataTypes.init ||
      actionType === messagesDataTypes.create
    ) {
      console.log("init or create and scroll");
      scrollToBottom(feedRef);
    } else if (actionType === messagesDataTypes.load) {
      console.log(
        currentHeight.current,
        totalMediaHeight,
        currentHeight.current + totalMediaHeight
      );
      if (firstLoad.current) {
        scrollToBottom(feedRef);
        firstLoad.current = false;
      } else {
        loadScroll(feedRef, currentHeight.current);
      }
    }
    setMessages((prev) =>
      prev.map((message) => {
        message.isNew = false;
        return message;
      })
    );
  });

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
        const isInit = messagesData.type === messagesDataTypes.init;
        const isLoad = messagesData.type === messagesDataTypes.load;
        const isCreate = messagesData.type === messagesDataTypes.create;
        const isDelete = messagesData.type === messagesDataTypes.delete;
        const isMyAction = messagesData.user === userId;

        setActionType(messagesData.type);

        const height = feedRef.current.scrollHeight;

        currentHeight.current = feedRef.current.scrollHeight;

        if (isCreate) {
          newMessages[0].isJustSent = true;
          setMessages((prev) => [...prev, ...newMessages]);
          if (isMyAction) {
            setLoading(false);
          } else {
            playAudio();
          }
          if (!getMediaExists(newMessages)) {
            scrollToBottom(feedRef);
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
          if (
            !getMediaExists(newMessages) &&
            actionType != messagesDataTypes.init
          ) {
            loadScroll(feedRef, height);
          }
          scrollToBottom(feedRef);
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

  useEffect(() => {
    if (justSentMediaLoaded) {
      scrollToBottom(feedRef);
      setJustSentMediaLoaded(false);
    }
  }, [justSentMediaLoaded]);

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
      <ImageLoadContext.Provider
        value={{
          registerMedia,
          loadMedia,
          setJustSentMediaLoaded,
          allMediaLoaded,
        }}
      >
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
