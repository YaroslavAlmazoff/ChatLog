import useDate from "../../common_hooks/date.hook";
import api from "../../auth/api/auth";
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";

const prefix = "/api";

export default function useAPI() {
  const { getCurrentDate } = useDate();
  const { token } = useContext(AuthContext);

  const sendMessage = async (id, text, files) => {
    const filesObject = files;
    const formData = new FormData();

    formData.append("message", text);
    formData.append("date", getCurrentDate());
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

    await api.post(`${prefix}/new-messages/${id}`, formData, {
      headers: `Bearer ${token}`,
    });
  };

  const getRoom = async (id) => {
    console.log(token);
    const response = await api.get(`${prefix}/room-by-id/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response);
    return response.data;
  };

  const deleteMessage = async (message) => {
    await api.delete(`${prefix}/message/${message._id}`);
  };

  return {
    sendMessage,
    getRoom,
    deleteMessage,
  };
}
