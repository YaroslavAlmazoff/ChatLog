import React, { useEffect, useState, useContext } from "react";
import UserItem from "./components/UserItem";
import "./styles/users.css";
import useRandom from "../common_hooks/random.hook";
import api from "./api/auth";
import Loader from "../common_components/Loader";
import useVerify from "../common_hooks/verify.hook";
import { AuthContext } from "../context/AuthContext";
import { useParams } from "react-router";

const Friends = () => {
  const auth = useContext(AuthContext);
  const params = useParams();
  const { verify } = useVerify();
  useEffect(() => {
    verify();
  }, []);
  //Страница всех пользователей и их поиска
  //Получение функции рандомного ключа из кстомного хука
  const { randomKey } = useRandom();
  //Инициализация состояния списка пользователей
  const [users, setUsers] = useState([]);
  useEffect(() => {
    if (!auth.userId) return;
    const getUsers = async () => {
      const response = await api.get("/api/friends/" + params.id, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      console.log(response);
      setUsers(response.data.friends);
    };
    getUsers();
  }, [auth, params]);

  return (
    <div className="users">
      {!users[0] ? (
        <Loader ml={"0%"} />
      ) : (
        <div className="users-list">
          {users.map((el) => (
            <UserItem
              key={randomKey()}
              name={el.name}
              surname={el.surname}
              age={el.age}
              avatarUrl={el.avatarUrl}
              id={
                el._id
              } /*isFriends={el.isFriends} friendsButtonText={el.friendsButtonText}*/
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Friends;
