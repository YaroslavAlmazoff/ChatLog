import React, { useContext, useEffect, useState } from "react";
import useRandom from "../../../common_hooks/random.hook";
import RoomItem from "../parts/RoomItem";
import "../styles/room-list.css";
import api from "../../../auth/api/auth";
import { AuthContext } from "../../../context/AuthContext";
import Loader from "../../../common_components/Loader";
import useVerify from "../../../common_hooks/verify.hook";

export const RoomsList = () => {
  const auth = useContext(AuthContext);
  const { verify } = useVerify();
  useEffect(() => {
    verify();
  }, []);
  const { randomKey } = useRandom();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!auth.userId) return;
    const getRooms = async () => {
      setLoading(true);
      const response = await api.get(`/api/getrooms`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      console.log(response);
      setRooms(response.data.rooms);
    };
    getRooms();
  }, [auth]);

  const createChat = () => {
    window.location = "/createchat";
  };

  return (
    <div className="center-column">
      <div className="room-list">
        <h1>Сообщения</h1>
        <button onClick={createChat} className="button">
          + Создать беседу
        </button>
        <div className="rooms-list-wrapper">
          {!loading ? (
            rooms.map((el) => <RoomItem key={randomKey()} room={el} />)
          ) : (
            <Loader ml={"50%"} />
          )}
        </div>
      </div>
    </div>
  );
};
