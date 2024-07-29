import useDate from "../../common_hooks/date.hook";
import api from "../../auth/api/auth";
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";

const prefix = "/api";

export default function useAPI() {
  const { getCurrentDate } = useDate();
  const { token } = useContext(AuthContext);

  const options = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const createEventSource = (id) => {
    return new EventSource(`https://chatlog.ru/api/connect/${id}`);
  };

  const sendMessage = async (id, text, files, offset) => {
    const filesObject = files;
    const formData = new FormData();

    formData.append("message", text);
    formData.append("date", getCurrentDate());
    formData.append("offset", offset);
    filesObject.imageFiles.forEach((file, i) => {
      formData.append("image", file, `image${i}.jpg`);
    });
    filesObject.videoFiles.forEach((file, i) => {
      formData.append("video", file, `video${i}.mp4`);
    });
    if (filesObject.audioFile) {
      formData.append("audio", filesObject.audioFile, "audio.mp3");
    }
    formData.append("isFile", !!localStorage.getItem("file-link"));

    await api.post(`${prefix}/new-messages/${id}`, formData, options);
  };

  const getRoom = async (id) => {
    const response = await api.get(`${prefix}/room-by-id/${id}`, options);
    return response.data;
  };

  const getMessages = async (page, offset) => {
    const response = await api.get(
      `${prefix}/messages/${page}/${offset}`,
      options
    );
    console.log(response);
  };

  const deleteMessage = async (message) => {
    await api.delete(`${prefix}/message/${message._id}`);
  };

  return {
    createEventSource,
    sendMessage,
    getRoom,
    getMessages,
    deleteMessage,
  };
}
