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
import {
  folders,
  messagesDataTypes,
  modalTypes,
  roomContentTypes,
  roomTypes,
  startMessagesCountCheck,
} from "../../data/messengerConfiguration";
import { AuthContext } from "../../../context/AuthContext";
import { ImageLoadContext } from "../../context/ImageLoadContext";
import { EditMessageContext } from "../../context/EditMessageContext";
import useScroll from "../../hooks/useScroll";
import messageSound from "../../audio/message.mp3";
import "../../styles/global.css";
import useMessage from "../../hooks/useMessage";
import useGroupAPI from "../../hooks/useGroupAPI";
import GroupRoomHead from "../components/GroupRoomHead";
import GroupSettings from "../components/GroupSettings/GroupSettings";
import AddMembers from "../components/GroupSettings/AddMembers";
import { GroupContext } from "../../context/GroupContext";
import RoomModal from "../components/RoomModal/RoomModal";

export default function Room({ type }) {
  const params = useParams();
  const { getRoom, createEventSource, getMessages, read } = useAPI();
  const {
    getGroupRoom,
    createGroupEventSource,
    getGroupMessages,
    readGroup,
    excludeMember,
    inviteMember,
  } = useGroupAPI();
  const { fileFromServer } = useFile();
  const { playAudio } = useAudio(messageSound);
  const { loadScroll, scrollToBottom } = useScroll();
  const { filterMessages, compareMessages } = useMessage();
  const { userId } = useContext(AuthContext);

  const feedRef = useRef(null);
  const currentHeight = useRef(0);
  const startMessagesCount = useRef(0);

  const [room, setRoom] = useState({ name: "", date: "", bg: "" });
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [offset, setOffset] = useState(0);
  const [error, setError] = useState(false);
  const [actionType, setActionType] = useState(messagesDataTypes.init);
  const [startLoading, setStartLoading] = useState(true);
  const [observerLoading, setObserverLoading] = useState(true);
  const [scrollLoading, setScrollLoading] = useState(false);
  const [sendLoading, setSendLoading] = useState(false);
  const [editingMessage, setEditingMessage] = useState(null);
  const [contentType, setContentType] = useState(roomContentTypes.messages);

  const setErrorCallback = useCallback((err) => {
    setError(err);
  }, []);

  const id = useMemo(() => params.id, [params]);
  const isGroup = type === roomTypes.group;

  const { register, load } = useLoad(() => {
    if (!feedRef.current) return;
    if (
      actionType === messagesDataTypes.init ||
      actionType === messagesDataTypes.create ||
      actionType === messagesDataTypes.edit
    ) {
      scrollToBottom(feedRef);
      setSendLoading(false);
      if (startMessagesCount.current >= startMessagesCountCheck) {
        setObserverLoading(false);
      }
    } else if (actionType === messagesDataTypes.load) {
      loadScroll(feedRef, currentHeight.current);
      setScrollLoading(false);
    }
  });

  const makeMessageOld = (message) => {
    setMessages((prev) => {
      return prev.map((item) =>
        item._id === message._id ? { ...item, isNew: false } : item
      );
    });
  };

  const updateRoom = (title, description) => {
    setRoom({ ...room, title, description });
  };

  const exclude = async (e, userId) => {
    e.stopPropagation();
    await excludeMember(id, userId);
    setRoom((prev) => {
      return {
        ...prev,
        members: prev.members.filter((member) => member._id !== userId),
      };
    });
  };

  const invite = async (e, newMember) => {
    e.stopPropagation();
    await inviteMember(id, newMember._id);
    setRoom((prev) => {
      return {
        ...prev,
        members: [...prev.members, newMember],
      };
    });
  };

  useEffect(() => {
    const getDataAndStartEventSource = async () => {
      const { room } = await (isGroup ? getGroupRoom(id) : getRoom(id));

      setRoom(room);

      const eventSource = isGroup
        ? createGroupEventSource(id)
        : createEventSource(id);
      eventSource.onmessage = function (event) {
        const messagesData = JSON.parse(event.data);
        const newMessages = messagesData.messages;
        const isInit = messagesData.type === messagesDataTypes.init;
        const isLoad = messagesData.type === messagesDataTypes.load;
        const isCreate = messagesData.type === messagesDataTypes.create;
        const isDelete = messagesData.type === messagesDataTypes.delete;
        const isEdit = messagesData.type === messagesDataTypes.edit;
        const isMyAction = messagesData.user === userId;

        setActionType(messagesData.type);
        currentHeight.current = feedRef.current.scrollHeight;

        if (isInit) {
          if (isGroup) {
            readGroup(newMessages, id);
          } else {
            read(newMessages, id);
          }
          startMessagesCount.current = newMessages.length;
        }
        if (isCreate) {
          newMessages[0].isNew = isMyAction ? true : false;
          setMessages((prev) => [...prev, ...newMessages]);
          if (!isMyAction) {
            playAudio();
            if (isGroup) {
              readGroup(newMessages, id);
            } else {
              read(newMessages, id);
            }
          } else {
            register();
          }
        } else if (isDelete) {
          setMessages((prev) => filterMessages(prev, newMessages));
          setOffset((prev) => prev - 1);
        } else if (isEdit) {
          setMessages((prev) =>
            compareMessages(
              prev,
              newMessages,
              messagesData.oldText,
              messagesData.firstOldImage,
              messagesData.firstOldVideo
            )
          );
          if (
            (newMessages[0].images.length || newMessages[0].videos.length) &&
            isMyAction
          ) {
            register();
          }
          if (isMyAction) {
            setEditingMessage(null);
            setSendLoading(false);
          }
        } else if ((isInit || isLoad) && isMyAction) {
          const newMessagesWithNewFlag = newMessages.map((message) => ({
            ...message,
            isNew: true,
          }));
          newMessagesWithNewFlag.forEach((u) => {
            register();
            console.log(`registered text in ${actionType}`, u.message);
          });
          setMessages((prev) => [...newMessagesWithNewFlag, ...prev]);
        }
        if (isMyAction) {
          setStartLoading(false);
          if (!newMessages.length) {
            setScrollLoading(false);
          }
        }
      };
    };
    getDataAndStartEventSource();
  }, [createEventSource, getRoom, playAudio, id, userId]);

  useEffect(() => {
    if (page !== 1) {
      setScrollLoading(true);
      if (isGroup) {
        getGroupMessages(page, offset);
      } else {
        getMessages(page, offset);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, getMessages]);

  return (
    <div
      className="block room-size room"
      style={{
        backgroundImage: room.bg
          ? `url(${fileFromServer(folders.bg, room.bg)})`
          : "",
      }}
    >
      <>
        {isGroup ? (
          <GroupRoomHead
            groupTitle={room.title}
            groupAvatarUrl={room.avatarUrl}
            setContentType={setContentType}
          />
        ) : (
          <RoomHead
            name={room.name}
            onlineDate={room.date}
            isOnline={room.isOnline}
          />
        )}
        <EditMessageContext.Provider
          value={{ editingMessage, setEditingMessage, isGroup }}
        >
          <ImageLoadContext.Provider value={{ register, load, makeMessageOld }}>
            <RoomMessages
              messages={messages}
              ref={feedRef}
              startLoading={startLoading}
              observerLoading={observerLoading}
              sendLoading={sendLoading}
              scrollLoading={scrollLoading}
              setPage={setPage}
            />
          </ImageLoadContext.Provider>
          <RoomMainField
            setRoom={setRoom}
            setOffset={setOffset}
            error={error}
            setErrorCallback={setErrorCallback}
            setSendLoading={setSendLoading}
            isGroup={isGroup}
          />
        </EditMessageContext.Provider>
      </>
      <GroupContext.Provider
        value={{
          room,
          contentType,
          setContentType,
          updateRoom,
          exclude,
          invite,
        }}
      >
        <RoomModal
          show={
            contentType === roomContentTypes.groupSettings ||
            contentType === roomContentTypes.addMembers
          }
          onClose={() => setContentType(roomContentTypes.messages)}
          type={modalTypes.neutral}
          padding="0"
        >
          {contentType === roomContentTypes.groupSettings ? (
            <GroupSettings />
          ) : (
            <></>
          )}
          {contentType === roomContentTypes.addMembers ? <AddMembers /> : <></>}
        </RoomModal>
      </GroupContext.Provider>
    </div>
  );
}
