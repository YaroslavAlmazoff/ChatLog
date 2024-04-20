import React, { useContext, useEffect, useState, useRef } from "react";
import "../styles/room.css";
import api from "../../../auth/api/auth";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import useDate from "../../../common_hooks/date.hook";
import ImagePreview1 from "../../../auth/parts/ImagePreview1";
import VideoPreview from "../../../auth/parts/VideoPreview";
import Message from "../parts/Message";
import { smiles } from "./smiles";
import Smile from "../parts/Smile";
import "../styles/smiles.css";
import "../styles/actions.css";
import Loader from "../../../common_components/Loader";
import useVerify from "../../../common_hooks/verify.hook";
import { findDOMNode } from "react-dom";
import useHighlight from "../../../common_hooks/highlight.hook";
import uuid from "uuid";
import MessengerImagePreview from "../parts/MessengerImagePreview";
import MessengerVideoPreview from "../parts/MessengerVideoPreview";
import ModalWindow from "../../../common_components/modal-window/ModalWindow";

export const ESRoomUpdated = () => {
  const { verify } = useVerify();
  useEffect(() => {
    verify();
  }, []);

  const messageRef = useRef(null);
  const messagesRef = useRef(null);
  const [id, setId] = useState("");
  const { randomColor, randomShadow, randomBlockShadow } = useHighlight();
  const { getCurrentDate } = useDate();
  const auth = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [penFriend, setPenFriend] = useState("");
  const [fullPenFriend, setFullPenFriend] = useState({});
  const [smilesDisplay, setSmilesDisplay] = useState("none");
  const [messageActionsDisplay, setMessageActionsDisplay] = useState("none");
  const [currentMessage, setCurrentMessage] = useState({});
  const [loading, setLoading] = useState(true);
  const [bg, setBg] = useState("");
  const params = useParams();
  const roomRef = useRef();
  const imageRef = useRef();
  const videoRef = useRef();
  const bgRef = useRef();
  const [imageFiles, setImageFiles] = useState([]);
  const [videoFiles, setVideoFiles] = useState([]);
  const [audioFile, setAudioFile] = useState(null);
  const [modal, setModal] = useState(false);
  const [page, setPage] = useState(1);
  const [isLast, setIsLast] = useState(false);

  const openWindow = () => {
    setModal(true);
    auth.darkScreen(true);
  };
  const closeWindow = () => {
    setModal(false);
    auth.darkScreen(false);
  };

  const [isRecording, setIsRecording] = useState(false);

  const removeDoubles = () => {
    setMessages((prev) =>
      prev.filter(
        (v, i, a) =>
          a.findIndex((t) => t.message === v.message && t.date === v.date) === i
      )
    );
  };

  useEffect(() => {
    if (localStorage.getItem("file-link")) {
      messageRef.current.value = localStorage.getItem("file-link");
    }
    const es = subscribe();
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const mediaRecorder = new MediaRecorder(stream);
      let voice = [];
      const startNode = document.querySelector("#start");
      const startDOMElement = findDOMNode(startNode);
      startDOMElement.addEventListener("click", function () {
        setIsRecording(true);
        mediaRecorder.start();
      });

      mediaRecorder.addEventListener("dataavailable", function (event) {
        voice.push(event.data);
      });

      const stopNode = document.querySelector("#stop");
      const stopDOMElement = findDOMNode(stopNode);
      stopDOMElement.addEventListener("click", function () {
        setIsRecording(false);
        mediaRecorder.stop();
      });

      mediaRecorder.addEventListener("stop", function () {
        const voiceBlob = new Blob(voice, { type: "audio/mpeg" });
        setAudioFile(voiceBlob);
      });
    });
    return () => {
      es.close();
    };
  }, []);

  const getMessages = async () => {
    !isLast && setLoading(true);
    await api.get(`/api/messages/${page}`, {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    });
  };

  function handleScroll(event) {
    const { scrollTop } = event.currentTarget;

    if (scrollTop === 0) {
      getMessages();
    }
  }
  const messagesEndRef = useRef(null);

  const handleScrollAttempt = (event) => {
    const { scrollTop, scrollHeight, clientHeight } = messagesRef.current;
    const wheelDelta = event.deltaY;

    // Проверяем, находимся ли мы в нижнем крае элемента и пытаемся прокрутить вниз,
    // или находимся ли мы в верхнем крае и пытаемся прокрутить вверх
    //const atBottom = (scrollTop + clientHeight === scrollHeight) && wheelDelta > 0;
    const atTop = scrollTop === 0 && wheelDelta < 0;

    if (atTop) {
      console.log("Попытка прокрутить за пределы возможного");
      // Здесь можно выполнить любую логику по реакции на попытку прокрутки
    }
  };

  // const scrollToBottom = () => {
  //   messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  // };

  // useEffect(() => {
  //   scrollToBottom();
  // }, [messages]);

  const subscribe = async () => {
    if (!params.id) return;
    setLoading(true);
    const eventSource = new EventSource(
      `${process.env.REACT_APP_API_URL}/api/connect/${params.id}/${page}`
    );
    eventSource.onmessage = function (event) {
      const messagesData = JSON.parse(event.data);
      console.log(messagesData);
      setMessages((prevMessages) => [
        ...messagesData.messages,
        ...prevMessages,
      ]);
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
      setPage((prevPage) => prevPage + 1);
      setIsLast(messagesData.isLast);
      removeDoubles();
      setLoading(false);
    };
    return eventSource;
  };

  const sendMessage = async () => {
    if (!currentMessage._id) {
      const text = messageRef.current.value;
      messageRef.current.value = "";
      const audio = audioFile;

      setImageFiles(null);
      setVideoFiles(null);
      setAudioFile(null);

      if (imageFiles.length > 5 || videoFiles.length > 2) {
        openWindow();
      }

      const formData = new FormData();

      formData.append("message", text);
      formData.append("date", getCurrentDate());
      imageFiles.forEach((file, i) => {
        formData.append("image", file, `image${i}.jpg`);
      });
      videoFiles.forEach((file, i) => {
        formData.append("video", file, `video${i}.mp4`);
      });
      if (audioFile) {
        formData.append("audio", audio, "audio.mp3");
      }
      formData.append("isFile", !!localStorage.getItem("file-link"));

      await api.post(`/api/new-messages/${params.id}`, formData, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
          Range: "bytes=100-",
        },
      });
    } else {
      await api.post(`/api/editmessage/${currentMessage._id}`, {
        message: messageRef.current.value,
      });
      messageRef.current.value = "";
      setMessageActionsDisplay("none");
      setCurrentMessage({});
      window.location.reload();
    }
  };

  const emitOpen = (type) => {
    type === "image" && imageRef.current.click();
    type === "video" && videoRef.current.click();
  };

  const getFile = async (e, type) => {
    const files = Array.from(e.target.files);
    type === "image" && setImageFiles(files);
    type === "video" && setVideoFiles(files);
  };

  const emitOpenBg = () => {
    bgRef.current.click();
  };

  const getFileBg = async (e) => {
    let file = e.target.files[0];
    let formData = new FormData();
    formData.append("file", file);
    const response = await api.post(`/api/uploadbg/${id}`, formData);
    setBg(response.data.filename);
  };

  useEffect(() => {
    const dialog = async () => {
      const response = await api.get(`/api/roombyid/${params.id}`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      setBg(response.data.room.bg);
      setId(response.data.room._id);
      const user1 = response.data.room.user1;
      const user2 = response.data.room.user2;

      let user = "";
      if (user1 === auth.userId) {
        user = user2;
      } else {
        user = user1;
      }
      const userResponse = await api.get(`/api/user/${user}`);
      setFullPenFriend(userResponse.data.user);
      const name = userResponse.data.user.name;
      const surname = userResponse.data.user.surname;
      const fullName = name + " " + surname;
      setPenFriend(fullName);
      setLoading(false);
    };
    dialog();
  }, [params, auth]);

  useEffect(() => {
    messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    const currentRef = messagesRef.current;
    currentRef.addEventListener("wheel", handleScrollAttempt);

    // Не забудьте снять обработчик события при размонтировании компонента

    const readMessage = async () => {
      const res = await api.get(`/api/read/${params.id}`);
    };
    if (!messages.length) {
      return;
    }
    if (auth.userId) {
      if (messages[messages.length - 1].user) {
        if (
          auth.userId.toString() !=
          messages[messages.length - 1].user.toString()
        ) {
          readMessage();
        }
      }
    }
    return () => {
      currentRef.removeEventListener("wheel", handleScrollAttempt);
    };
  }, [auth, messages, params]);

  const addSmile = (code) => {
    setSmilesDisplay("none");
    messageRef.current.value = messageRef.current.value + code;
  };
  const showSmiles = () => {
    if (smilesDisplay === "none") {
      setSmilesDisplay("block");
      setTimeout(() => {
        setSmilesDisplay("none");
      }, 10000);
    } else {
      setSmilesDisplay("none");
    }
  };

  const deleteMessage = async () => {
    const res = await api.get(`/api/deletemessage/${currentMessage._id}`);
    setMessages([...messages].filter((el) => el._id !== currentMessage._id));
    setMessageActionsDisplay("none");
    setCurrentMessage({});
  };
  const editMessage = async () => {
    messageRef.current.value = currentMessage.message;
  };

  const showMessageActions = (mess) => {
    if (auth.userId == mess.user) {
      setMessageActionsDisplay("block");
      setCurrentMessage(mess);
      setTimeout(() => {
        setMessageActionsDisplay("none");
      }, 10000);
    }
  };

  const onConfirm = () => {
    auth.darkScreen(false);
  };

  return (
    <div className="room-wrapper">
      {modal && (
        <ModalWindow
          isOpen={modal}
          onClose={closeWindow}
          onConfirm={onConfirm}
          type="info"
          text="Нельзя загружать более 5 фото, 2 видео и 1 аудио в одном сообщении"
        />
      )}
      <div
        ref={roomRef}
        className="room-window block"
        style={{
          backgroundImage: `url(${
            process.env.REACT_APP_API_URL + "/roombackgrounds/" + bg
          })`,
        }}
      >
        <div className="room-head">
          <div
            className="room-message-actions"
            style={{ display: messageActionsDisplay }}
          >
            <span
              onClick={editMessage}
              className="room-message-action1"
              style={{ color: "rgb(0, 140, 255)" }}
            >
              Редактировать
            </span>
            <span
              onClick={deleteMessage}
              className="room-message-action2"
              style={{ color: "red" }}
            >
              Удалить
            </span>
          </div>
          <span className={`${randomColor()} ${randomShadow()}`}>
            {penFriend} | В сети {fullPenFriend.lastVisit}
          </span>
        </div>
        <div className="room-smiles" style={{ display: smilesDisplay }}>
          {smiles.map((el) => (
            <Smile key={el.code} el={el} addSmile={addSmile} />
          ))}
        </div>
        <div
          className="messages"
          ref={messagesRef}
          onScroll={handleScroll}
          style={{ overflowY: "auto", height: "100vh" }}
        >
          {!loading ? (
            messages.map((mess) => (
              <Message mess={mess} showMessageActions={showMessageActions} />
            ))
          ) : (
            <Loader ml="0%" />
          )}
          <img
            onClick={(e) => emitOpenBg(e)}
            className="upload-bg"
            src={require("../../img/upload-bg.png")}
            alt=""
            title="Установить фон для переписки"
          />
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="message-actions">
        <img
          id="stop"
          className="upload-message-image"
          style={
            isRecording ? { display: "inline-block" } : { display: "none" }
          }
          src={require(`../../img/stop.png`)}
          alt="img"
        />
        <input
          ref={messageRef}
          type="text"
          className={
            !isRecording ? "message-input input" : "message-input-recording"
          }
          placeholder={!isRecording ? "Напишите сообщение..." : "Говорите..."}
        />
        <img
          onClick={showSmiles}
          className="upload-message-image"
          src={require(`../../img/smile.png`)}
          alt="img"
        />
        <img
          onClick={() => emitOpen("image")}
          className="upload-message-image"
          src={require(`../../img/upload-image.png`)}
          alt="img"
        />
        <img
          onClick={() => emitOpen("video")}
          className="upload-message-image"
          src={require(`../../img/upload-video.png`)}
          alt="img"
        />
        {!isRecording ? (
          <img
            id="start"
            className="upload-message-image"
            src={require(`../../img/recording.png`)}
            alt="img"
          />
        ) : null}
        <img
          onClick={sendMessage}
          className="upload-message-image"
          src={require(`../../img/send.png`)}
          alt="img"
        />
        <input
          onChange={(e) => getFile(e, "image")}
          ref={imageRef}
          type="file"
          accept=".jpg,.jpeg,.png,.gif"
        />
        <input
          onChange={(e) => getFile(e, "video")}
          ref={videoRef}
          type="file"
          accept=".mp4"
        />
        <input
          onChange={(e) => getFileBg(e)}
          ref={bgRef}
          type="file"
          accept=".jpg,.jpeg,.png,.gif"
        />
      </div>
      {imageFiles.length &&
        imageFiles.map((imageFile) => (
          <MessengerImagePreview imageFile={imageFile} />
        ))}
      {videoFiles.length &&
        imageFiles.map((videoFile) => (
          <MessengerVideoPreview videoFile={videoFile} />
        ))}
    </div>
  );
};
