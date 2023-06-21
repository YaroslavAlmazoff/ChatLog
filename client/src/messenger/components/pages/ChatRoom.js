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
import AddMembers from "../parts/AddMembers";
import "../styles/room-list.css";
import Members from "../parts/Members";
import { findDOMNode } from "react-dom";
import useHighlight from "../../../common_hooks/highlight.hook";

const ChatRoom = () => {
  const { verify } = useVerify();
  const { randomColor, randomShadow, randomBlockShadow } = useHighlight();
  const [messageActionsDisplay, setMessageActionsDisplay] = useState("none");
  useEffect(() => {
    verify();
  }, [verify]);
  const [bg, setBg] = useState();
  useEffect(() => {
    if (localStorage.getItem("file-link")) {
      console.log(localStorage.getItem("file-link"));
      messageRef.current.value = localStorage.getItem("file-link");
    }
    subscribe();
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const mediaRecorder = new MediaRecorder(stream);
      let voice = [];
      const startNode = document.querySelector("#start");
      console.log(startNode);
      const startDOMElement = findDOMNode(startNode);
      console.log(startDOMElement);
      startDOMElement.addEventListener("click", function () {
        setIsRecording(true);
        mediaRecorder.start();
        console.log("start");
      });

      mediaRecorder.addEventListener("dataavailable", function (event) {
        voice.push(event.data);
      });

      const stopNode = document.querySelector("#stop");
      console.log(stopNode);
      const stopDOMElement = findDOMNode(stopNode);
      console.log(stopDOMElement);
      stopDOMElement.addEventListener("click", function () {
        console.log("aaaaaaaa");
        setIsRecording(false);
        mediaRecorder.stop();
        console.log("stop");
      });

      mediaRecorder.addEventListener("stop", function () {
        const voiceBlob = new Blob(voice, { type: "audio/mpeg" });

        console.log(voice, voiceBlob);
        const reader = new FileReader();
        reader.readAsDataURL(voiceBlob);

        reader.onload = (event) => {
          var base64data = event.target.result;
          console.log(base64data);
          setAudioFile(base64data);
        };
      });
    });
  }, []);

  const removeDublicates = () => {
    setMessages((prev) =>
      prev.filter(
        (v, i, a) =>
          a.findIndex((t) => t.message === v.message && t.date === v.date) === i
      )
    );
  };

  const subscribe = async () => {
    if (!params.id) return;
    console.log("connection");
    const eventSource = new EventSource(
      `https://chatlog.ru/api/connect/${params.id}`
    );
    console.log(eventSource);
    eventSource.onmessage = function (event) {
      const messagesData = JSON.parse(event.data);
      setMessages(messagesData);
      removeDublicates();
      roomRef.current.scrollTop = roomRef.current.scrollHeight;
    };
  };
  const messageRef = useRef(null);
  const [room, setRoom] = useState({ members: [] });
  const { getCurrentDate } = useDate();
  const auth = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [smilesDisplay, setSmilesDisplay] = useState("none");
  const [messageActions, setMessageActions] = useState(false);
  const [currentMessage, setCurrentMessage] = useState({});
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const roomRef = useRef();
  const fileRef = useRef();
  const bgRef = useRef();
  const fileRefVideo = useRef();

  const [isRecording, setIsRecording] = useState(false);

  const [imagePreviewDisplay1, setImagePreviewDisplay1] = useState("none");
  const [imagePreviewUrl1, setImagePreviewUrl1] = useState("");
  const [videoPreviewUrl, setVideoPreviewUrl] = useState("");
  const [videoPreviewDisplay, setVideoPreviewDisplay] = useState("none");
  const [file, setFile] = useState("");
  const [bgFile, setBgFile] = useState("");
  const [videoFile, setVideoFile] = useState("");
  const [audioFile, setAudioFile] = useState("");

  const declination = (count = "0") => {
    console.log(count);
    if (!count) return;
    const last = count.toString().slice(-1);
    console.log(last);
    if (last === "0") {
      return count + " участников";
    } else if (last === "1") {
      return count + " участник";
    } else if (last > "1" && last < "5") {
      return count + " участника";
    } else if (last > "5") {
      return count + " участников";
    }
  };

  useEffect(() => {
    setMembersText(declination(room.members.length));
  }, [room]);

  const addMembersCount = (count) => {
    setMembersText(declination(room.members.length + count));
  };

  useEffect(() => {
    const getMessages = async () => {
      setLoading(true);
      const response = await api.get(`/api/getchatmessagesstart/${params.id}`);
      setMessages(
        response.data.messages.filter(
          (v, i, a) =>
            a.findIndex((t) => t.message === v.message && t.date === v.date) ===
            i
        )
      );
      roomRef.current.scrollTop = roomRef.current.scrollHeight;
      setLoading(false);
    };
    getMessages();
  }, [params]);

  const [isAddMembers, setIsMembers] = useState(false);
  const [isCheckMembers, setIsCheckMembers] = useState(false);
  const [buttonText, setButtonText] = useState("+ Добавить");
  const [membersText, setMembersText] = useState("");

  const openAddMembers = () => {
    setIsMembers(true);
    setButtonText("Отмена");
  };
  const closeAddMembers = () => {
    setIsMembers(false);
    setButtonText("+ Добавить");
  };
  const openMembers = () => {
    setIsCheckMembers(true);
    setMembersText("К сообщениям");
  };
  const closeMembers = () => {
    setIsCheckMembers(false);
    setMembersText(declination(room.members.length));
  };

  //Эмитирование открытия загрузки файла изображения для поста
  const emitOpen = () => {
    fileRef.current.click();
  };
  //Получение файла изображения поста пользователя
  const getFile = async (e) => {
    let file = e.target.files[0];
    console.log(file);
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (file.type === "image/jpeg" || file.type === "image/png") {
        setImagePreviewDisplay1("block");
        setImagePreviewUrl1(ev.target.result);
      } else {
        setVideoPreviewDisplay("block");
        setVideoPreviewUrl(ev.target.result);
      }
    };
    reader.readAsDataURL(file);
    //Загрузка файла в состояние
    setFile(file);
  };
  //Эмитирование открытия загрузки файла изображения для поста
  const emitOpenVideo = () => {
    fileRefVideo.current.click();
  };
  //Получение файла изображения поста пользователя
  const getFileVideo = async (e) => {
    let file = e.target.files[0];
    console.log(file);
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (file.type === "image/jpeg" || file.type === "image/png") {
        setImagePreviewDisplay1("block");
        setImagePreviewUrl1(ev.target.result);
      } else {
        setVideoPreviewDisplay("block");
        setVideoPreviewUrl(ev.target.result);
      }
    };
    reader.readAsDataURL(file);
    //Загрузка файла в состояние
    setVideoFile(file);
  };

  const emitOpenBg = () => {
    bgRef.current.click();
  };
  //Получение файла изображения поста пользователя
  const getFileBg = async (e) => {
    let file = e.target.files[0];
    console.log(file);
    let formData = new FormData();
    formData.append("file", file);
    const response = await api.post(`/api/uploadbg/${room._id}`, formData);
    setBg(response.data.filename);
  };

  useEffect(() => {
    const dialog = async () => {
      setLoading(true);
      const response = await api.get(`/api/chatroombyid/${params.id}`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      setRoom(response.data.room);
      setBg(response.data.room.bg);
      setLoading(false);
    };
    dialog();
  }, [params, auth]);

  // useEffect(() => {
  //     const readMessage = async () => {
  //         const res = await api.get(`/api/chatread/${messages[messages.length - 1]._id}`, {
  //             headers: {Authorization: `Bearer ${auth.token}`}
  //         })
  //         console.log(res)
  //     }
  //     if(!messages.length) {
  //         return
  //     }

  //     if(auth.userId !== messages[messages.length - 1].user) {
  //         readMessage()
  //     }
  // }, [auth, messages])

  const sendMessage = async () => {
    if (!currentMessage._id) {
      const text = messageRef.current.value;
      messageRef.current.value = "";
      const imageUrl = imagePreviewUrl1;
      const videoUrl = videoPreviewUrl;
      const audioUrl = audioFile;
      setVideoFile("");
      setFile("");
      setAudioFile("");
      console.log(imageUrl);
      await api.post(
        `/api/new-messages/${params.id}`,
        {
          message: text,
          date: getCurrentDate(),
          file: imageUrl,
          videoFile: videoUrl,
          audioFile: audioUrl,
          isFile: !!localStorage.getItem("file-link"),
        },
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
            Range: "bytes=100-",
          },
        }
      );
    } else {
      await api.post(`/api/editchatmessage/${currentMessage._id}`, {
        message: messageRef.current.value,
      });
      messageRef.current.value = "";
      setMessageActions(false);
      setCurrentMessage({});
      window.location.reload();
    }
  };
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
    console.log("sesh");
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
      console.log("sesh", messageActionsDisplay, currentMessage);
    }
  };

  useEffect(() => {
    const readMessage = async () => {
      const res = await api.get(`/api/chatread/${params.id}`);
      console.log(res);
    };
    if (!messages.length) {
      return;
    }
    if (messages[messages.length - 1].user) {
      console.log(
        auth.userId,
        messages[messages.length - 1],
        messages[messages.length - 1].user
      );
      console.log(
        auth.userId.toString() != messages[messages.length - 1].user.toString()
      );
      if (
        auth.userId.toString() != messages[messages.length - 1].user.toString()
      ) {
        console.log("what");
        readMessage();
      }
    }
  }, [auth, messages, params]);

  return (
    <div className="room-wrapper">
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
          <span
            onClick={!isCheckMembers ? openMembers : closeMembers}
            className={`${randomColor()} ${randomShadow()}`}
            style={{ cursor: "pointer" }}
          >
            {membersText} |
            <button
              className="button"
              style={{ pading: "8px" }}
              onClick={!isAddMembers ? openAddMembers : closeAddMembers}
            >
              {buttonText}
            </button>
          </span>
        </div>
        {messageActions && (
          <>
            <div className="room-message-actions">
              <span
                onClick={editMessage}
                className="room-message-action"
                style={{ color: "rgb(0, 140, 255)" }}
              >
                Редактировать
              </span>
              <span
                onClick={deleteMessage}
                className="room-message-action"
                style={{ color: "red" }}
              >
                Удалить
              </span>
            </div>
          </>
        )}
        <div className="room-smiles" style={{ display: smilesDisplay }}>
          {smiles.map((el) => (
            <Smile key={el.code} el={el} addSmile={addSmile} />
          ))}
        </div>
        <div className="messages">
          {!isCheckMembers ? (
            <>
              {!isAddMembers ? (
                <>
                  {!loading ? (
                    messages.map((mess) => (
                      <Message
                        mess={mess}
                        showMessageActions={showMessageActions}
                      />
                    ))
                  ) : (
                    <Loader ml={"50%"} />
                  )}
                </>
              ) : (
                <AddMembers
                  close={closeAddMembers}
                  addMembersCount={addMembersCount}
                />
              )}
            </>
          ) : (
            <Members />
          )}
          <img
            onClick={(e) => emitOpenBg(e)}
            className="upload-bg"
            src={require("../../img/upload-bg.png")}
            alt=""
            title="Установить фон для переписки"
          />
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
          className="message-input input"
          placeholder={!isRecording ? "Напишите сообщение..." : "Говорите..."}
        />
        <img
          onClick={showSmiles}
          className="upload-message-image"
          src={require(`../../img/smile.png`)}
          alt="img"
        />
        <img
          onClick={(e) => emitOpen(e)}
          className="upload-message-image"
          src={require(`../../img/upload-image.png`)}
          alt="img"
        />
        <img
          onClick={(e) => emitOpenVideo(e)}
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
          onChange={(e) => getFile(e)}
          ref={fileRef}
          type="file"
          accept=".jpg,.jpeg,.png,.gif"
        />
        <input
          onChange={(e) => getFileVideo(e)}
          ref={fileRefVideo}
          type="file"
          accept=".mp4"
        />
        <input
          onChange={(e) => getFileBg(e)}
          ref={bgRef}
          type="file"
          accept=".jpg,.png,.jpeg,.gif"
        />
      </div>
      {file.type === "image/jpeg" || file.type === "image/png" ? (
        <ImagePreview1
          imagePreviewUrl1={imagePreviewUrl1}
          imagePreviewDisplay1={imagePreviewDisplay1}
        />
      ) : (
        <VideoPreview
          videoPreviewDisplay={videoPreviewDisplay}
          videoPreviewUrl={videoPreviewUrl}
        />
      )}
    </div>
  );
};

export default ChatRoom;
