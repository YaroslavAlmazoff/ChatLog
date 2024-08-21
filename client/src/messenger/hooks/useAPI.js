import useDate from "../../common_hooks/date.hook";
import api from "../../auth/api/auth";
import { AuthContext } from "../../context/AuthContext";
import { useCallback, useContext, useMemo } from "react";

const prefix = "/api";

export default function useAPI() {
  const { getCurrentDate } = useDate();
  const { token } = useContext(AuthContext);

  const options = useMemo(
    () => ({
      headers: { Authorization: `Bearer ${token}` },
    }),
    [token]
  );

  const createEventSource = useCallback((id) => {
    return new EventSource(`https://chatlog.ru/api/connect/${id}`);
  }, []);

  const sendMessage = useCallback(
    async (id, text, files) => {
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

      const response = await api.post(
        `${prefix}/new-messages/${id}`,
        formData,
        options
      );
      console.log(response);
    },
    [getCurrentDate, options]
  );

  const getRoom = useCallback(
    async (id) => {
      const response = await api.get(`${prefix}/room-by-id/${id}`, options);
      return response.data;
    },
    [options]
  );

  const getMessages = useCallback(
    async (page, offset) => {
      console.log("get messages");
      const response = await api.get(
        `${prefix}/messages/${page}/${offset}`,
        options
      );
      console.log(response);
    },
    [options]
  );

  const deleteMessage = useCallback(async (message) => {
    await api.delete(`${prefix}/message/${message._id}`);
  }, []);

  return {
    createEventSource,
    sendMessage,
    getRoom,
    getMessages,
    deleteMessage,
  };
}
