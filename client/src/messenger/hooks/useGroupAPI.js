import useDate from "../../common_hooks/date.hook";
import api from "../../auth/api/auth";
import { AuthContext } from "../../context/AuthContext";
import { useCallback, useContext, useMemo } from "react";
import { messengerErrors } from "../data/errors";
import useFile from "./useFile";
import auth from "../../auth/api/auth";

const prefix = "/api";

export default function useGroupAPI(openModal, setErrorCallback) {
  const { getCurrentDate } = useDate();
  const { token, userId } = useContext(AuthContext);
  const { checkErrorWhileSendingFiles } = useFile();

  const options = useMemo(
    () => ({
      headers: { Authorization: `Bearer ${token}` },
    }),
    [token]
  );

  const createGroupEventSource = useCallback(
    (id) => {
      return new EventSource(`https://chatlog.ru/api/connect/${id}/${userId}`);
    },
    [userId]
  );

  const sendGroupMessage = useCallback(
    async (id, text, files) => {
      const checkingSizeError = checkErrorWhileSendingFiles(files);
      if (checkingSizeError.isError) {
        setErrorCallback(true);
        openModal(checkingSizeError.text);
        return;
      }

      const filesObject = files;

      const formData = new FormData();

      formData.append("message", text);
      formData.append("date", getCurrentDate());
      filesObject.imageFiles.forEach((file, i) => {
        console.log(file);
        formData.append(`image${i}`, file.file, `image${i}.jpg`);
      });
      filesObject.videoFiles.forEach((file, i) => {
        formData.append(`video${i}`, file.file, `video${i}.mp4`);
      });
      if (filesObject.audioFile) {
        formData.append("audio", filesObject.audioFile.file, "audio.mp3");
      }
      formData.append("imageExists", !!filesObject.imageFiles.length);
      formData.append("videoExists", !!filesObject.videoFiles.length);
      formData.append("audioExists", !!filesObject.audioFile);
      formData.append("isFile", !!localStorage.getItem("file-link"));

      try {
        await api.post(`${prefix}/new-messages/${id}`, formData, options);
      } catch (e) {
        setErrorCallback(true);
        openModal(messengerErrors.sendError);
      }
    },
    [
      getCurrentDate,
      checkErrorWhileSendingFiles,
      openModal,
      setErrorCallback,
      options,
    ]
  );

  const getGroupRoom = useCallback(
    async (id) => {
      const response = await api.get(`${prefix}/room-by-id/${id}`, options);
      return response.data;
    },
    [options]
  );

  const getGroupMessages = useCallback(
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

  const deleteGroupMessage = useCallback(
    async (message) => {
      const response = await api.delete(
        `${prefix}/message/${message._id}`,
        options
      );
      console.log(response);
    },
    [options]
  );

  const editGroupMessage = useCallback(
    async (id, text, files) => {
      const checkingSizeError = checkErrorWhileSendingFiles(files);
      if (checkingSizeError.isError) {
        setErrorCallback(true);
        openModal(checkingSizeError.text);
        return;
      }

      const filesObject = files;
      const formData = new FormData();
      formData.append("message", text);
      filesObject.imageFiles.forEach((file, i) => {
        formData.append(`image${i}`, file.file, `image${i}.jpg`);
      });
      filesObject.videoFiles.forEach((file, i) => {
        formData.append(`video${i}`, file.file, `video${i}.mp4`);
      });
      formData.append("imageExists", !!filesObject.imageFiles.length);
      formData.append("videoExists", !!filesObject.videoFiles.length);

      await api.patch(`${prefix}/message/${id}`, formData, options);
    },
    [options]
  );

  const readGroup = useCallback(
    async (messages, roomId) => {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.user !== userId) {
        const response = await api.get(`${prefix}/read/${roomId}`, options);
        console.log(response);
      }
    },
    [options]
  );

  const uploadGroupBg = useCallback(
    async (file, roomId) => {
      const formData = new FormData();
      formData.append("file", file);
      const response = await api.post(
        `${prefix}/uploadbg/${roomId}`,
        formData,
        options
      );
      return response.data.filename;
    },
    [options]
  );

  return {
    createGroupEventSource,
    sendGroupMessage,
    getGroupRoom,
    getGroupMessages,
    deleteGroupMessage,
    editGroupMessage,
    readGroup,
    uploadGroupBg,
  };
}
