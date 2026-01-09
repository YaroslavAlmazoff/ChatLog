import { useContext } from "react";
import { useParams } from "react-router";
import { AuthContext } from "../../context/AuthContext";
import api from "../api/auth";

const MessageAction = () => {
  const { token } = useContext(AuthContext);
  const params = useParams();

  const createRoom = async () => {
    const response = await api.get(`/api/check-rooms/${params.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.data.exists) {
      window.location = `/messages/${response.data.room}`;
    } else {
      const response = await api.get(`/api/create-room/${params.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      window.location = `/messages/${response.data.room}`;
    }
  };
  return (
    <button onClick={createRoom} className="user-action dark-button">
      Написать сообщение
    </button>
  );
};

export default MessageAction;
