import api from "../api/auth";
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";
import useDate from "../../common_hooks/date.hook";

const usePhotos = () => {
  const auth = useContext(AuthContext);
  const { getCurrentDate } = useDate();

  const sendPhoto = async (file) => {
    if (file) {
      const currentDate = getCurrentDate();
      const formData = new FormData();
      formData.append("file", file);
      formData.append("date", currentDate);
      formData.append("likes", 0);
      formData.append("comments", 0);
      const response = await api.post(`/api/createuserfoto`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${auth.token}`,
        },
      });
      return response.data.photo;
    }
  };
  const deletePhoto = async (url, setPhotos) => {
    await api.delete(`/api/deleteuserfoto/${url}`);
    setPhotos((prev) => prev.filter((photo) => photo.imageUrl !== url));
  };
  return { sendPhoto, deletePhoto };
};

export default usePhotos;
