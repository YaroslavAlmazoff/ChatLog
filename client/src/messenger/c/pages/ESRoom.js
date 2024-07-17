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

export const ESRoom = () => {
  const { verify } = useVerify();
  useEffect(() => {
    verify();
  }, []);
  const messageRef = useRef(null);
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
  const fileRef = useRef();
  const bgRef = useRef();
  const fileRefVideo = useRef();

  const [isRecording, setIsRecording] = useState(false);

  const removeDublicates = () => {
    setMessages((prev) =>
      prev.filter(
        (v, i, a) =>
          a.findIndex((t) => t.message === v.message && t.date === v.date) === i
      )
    );
  };

  const [imagePreviewDisplay1, setImagePreviewDisplay1] = useState("none");
  const [imagePreviewUrl1, setImagePreviewUrl1] = useState("");
  const [videoPreviewUrl, setVideoPreviewUrl] = useState("");
  const [videoPreviewDisplay, setVideoPreviewDisplay] = useState("none");
  const [file, setFile] = useState("");
  const [videoFile, setVideoFile] = useState("");
  const [bgFile, setBgFile] = useState("");
  const [audioFile, setAudioFile] = useState("");

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

  useEffect(() => {
    const getMessages = async () => {
      const response = await api.get(`/api/getmessagesstart/${params.id}`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      setMessages(
        response.data.messages.filter(
          (v, i, a) =>
            a.findIndex((t) => t.message === v.message && t.date === v.date) ===
            i
        )
      );
      roomRef.current.scrollTop = roomRef.current.scrollHeight;
    };
    getMessages();
  }, [params]);

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

  const sendMessage = async () => {
    if (!currentMessage._id) {
      setVideoFile("");
      setFile("");
      const text = messageRef.current.value;
      messageRef.current.value = "";

      const imageUrl = imagePreviewUrl1;
      const videoUrl = videoPreviewUrl;
      const audioUrl = audioFile;

      setImagePreviewDisplay1("none");
      setImagePreviewUrl1("");
      setVideoPreviewDisplay("none");
      setVideoPreviewUrl("");
      setAudioFile("");

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
      await api.post(`/api/editmessage/${currentMessage._id}`, {
        message: messageRef.current.value,
      });
      messageRef.current.value = "";
      setMessageActionsDisplay("none");
      setCurrentMessage({});
      window.location.reload();
    }
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
        window.scrollTo(0, document.body.scrollHeight);
      } else {
        setVideoPreviewDisplay("block");
        setVideoPreviewUrl(ev.target.result);
        window.scrollTo(0, document.body.scrollHeight);
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
    const readMessage = async () => {
      const res = await api.get(`/api/read/${params.id}`);
      console.log(res);
    };
    if (!messages.length) {
      return;
    }
    if (auth.userId) {
      if (messages[messages.length - 1].user) {
        console.log(
          auth.userId,
          messages[messages.length - 1],
          messages[messages.length - 1].user
        );
        console.log(
          auth.userId.toString() !=
            messages[messages.length - 1].user.toString()
        );
        if (
          auth.userId.toString() !=
          messages[messages.length - 1].user.toString()
        ) {
          console.log("what");
          readMessage();
        }
      }
    }
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
          <span className={`${randomColor()} ${randomShadow()}`}>
            {penFriend} | В сети {fullPenFriend.lastVisit}
          </span>
        </div>
        <div className="room-smiles" style={{ display: smilesDisplay }}>
          {smiles.map((el) => (
            <Smile key={el.code} el={el} addSmile={addSmile} />
          ))}
        </div>
        <div className="messages">
          {!loading ? (
            messages.map((mess) => (
              <Message mess={mess} showMessageActions={showMessageActions} />
            ))
          ) : (
            <Loader ml={"50%"} />
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
          accept=".jpg,.jpeg,.png,.gif"
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
