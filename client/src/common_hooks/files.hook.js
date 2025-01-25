import api from "../auth/api/auth";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const useFiles = () => {
  const auth = useContext(AuthContext);
  const getFileToDownload = async (file) => {
    const response = await api.get(`/api/cloud/filetodownload/${file.name}`, {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    });
    return response.data.file;
  };
  const emitOpen = (ref) => {
    ref.current.click();
  };
  const getFile = async (e, onLoad) => {
    let file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (ev) => {
      onLoad();
    };
    reader.readAsDataURL(file);
    return file;
  };

  return { getFileToDownload, emitOpen, getFile };
};

export default useFiles;
