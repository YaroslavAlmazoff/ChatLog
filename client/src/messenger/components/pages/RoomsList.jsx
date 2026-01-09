import React, { useContext, useEffect, useState } from "react";
import useRandom from "../../../common_hooks/random.hook";
import RoomItem from "../components/RoomItem";
import api from "../../../auth/api/auth";
import { AuthContext } from "../../../context/AuthContext";
import Loader from "../../../common_components/Loader";
import { useNavigate } from "react-router";
import "../../styles/RoomList.css";

export default function RoomsList() {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const { randomKey } = useRandom();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!auth.userId) return;
    const getRooms = async () => {
      setLoading(true);
      const response = await api.get(`/api/get-rooms`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      console.log(response);
      setRooms(response.data.rooms);
      setLoading(false);
    };
    getRooms();
  }, []);

  const createChat = () => {
    navigate("/createchat");
  };

  return (
    <div className="center-column">
      <div className="room-list">
        <h1>Сообщения</h1>
        <button
          onClick={createChat}
          className="button"
          style={{ marginLeft: "0" }}
        >
          + Создать беседу
        </button>
        <div className="rooms-list-wrapper mt">
          {!loading ? (
            <>
              {rooms.length ? (
                rooms.map((el) => <RoomItem key={randomKey()} room={el} />)
              ) : (
                <span>У Вас нет переписок</span>
              )}
            </>
          ) : (
            <Loader ml={"50%"} />
          )}
        </div>
      </div>
    </div>
  );
}
