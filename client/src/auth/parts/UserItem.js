import React, { useContext, useEffect, useState } from "react";
import "../styles/user-item.css";
import api from "../api/auth";
import { AuthContext } from "../../context/AuthContext";
import useHighlight from "../../common_hooks/highlight.hook";

const UserItem = ({
  name,
  surname,
  age,
  avatarUrl,
  id /*, isFriends, friendsButtonText*/,
}) => {
  const [loading, setLoading] = useState(true);
  const auth = useContext(AuthContext);
  const { randomColor, randomShadow, randomBlockShadow } = useHighlight();
  //Предпросмотр пользователя на странице со всеми пользователями
  //Перемещение на страницу пользователя
  const gotoUser = (id) => {
    window.location = `/user/${id}`;
  };

  const createRoom = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);
    const response = await api.get(`/api/checkrooms/${id}`, {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    });
    console.log(response.data.room);
    if (response.data.room) {
      window.location = `/messages/${response.data.room}`;
    } else {
      const response1 = await api.get(`/api/createroom/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      console.log(response1);
      const response2 = await api.get(`/api/getroom/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      console.log(response2);
      window.location = `/messages/${response2.data.room._id}`;
    }
  };
  const makeFriends = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    // friendsButtonText = 'Вы отправили заявку'
    // isFriends = true
    //Получение ID пользователей
    const user1 = auth.userId;
    const user2 = id;
    //Проверка есть ли пользователь в друзьях у его посетителя
    if (localStorage.getItem(user2) === user1) {
      console.log(localStorage.getItem(user2) === user1);
      return false;
    }
    //Отправка заявки в друзья
    const response = await api.get(`/api/makefriends/${user2}`, {
      headers: { Authorization: `Bearer ${auth.token}` },
    });
    console.log(response);
    //Создание записи в локальном хранилище браузера о том что пользователь и посетитель его страницы - друзья
    localStorage.setItem(user2, user1);
  };
  // const noop = (e) => {
  //     e.preventDefault()
  //     e.stopPropagation()
  //     console.log('тяжелый случай', e)
  // }
  return (
    <div
      onClick={() => gotoUser(id)}
      className={`user-item ${randomBlockShadow()}`}
    >
      <div className="user-item-right-side">
        <div>
          <img
            className={`user-item-img ${randomBlockShadow()}`}
            src={process.env.REACT_APP_API_URL + "/useravatars/" + avatarUrl}
            alt="user"
          />
        </div>
        <div className="user-item-info">
          <h3 className={`user-item-name ${randomColor()} ${randomShadow()}`}>
            {name} {surname}
          </h3>
          <p className="user-item-age">{age}</p>
        </div>
      </div>
      <div>
        {id !== auth.userId ? (
          <div className="user-item-actions">
            {isFriends ? (
              <button
                onClick={(e) => createRoom(e)}
                className="button"
                style={{ marginBottom: "5px" }}
              >
                Написать сообщение
              </button>
            ) : (
              <button
                onClick={!isFriends ? (e) => makeFriends(e) : (e) => noop(e)}
                className="button"
              >
                {friendsButtonText}
              </button>
            )}
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default UserItem;
