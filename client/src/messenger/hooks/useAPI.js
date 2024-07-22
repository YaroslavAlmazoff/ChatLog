import useDate from "../../common_hooks/date.hook";
import api from "../../auth/api/auth";
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";

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

    await api.post(`/api/new-messages/${id}`, formData, {
      headers: `Bearer ${token}`,
    });
  };

  const deleteMessage = async (message) => {
    await api.delete(`/api/message/${message._id}`);
  };

  return {
    sendMessage,
    deleteMessage,
  };
}
