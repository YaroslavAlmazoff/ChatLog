import React, { useContext, useEffect, useState } from "react";
import "../styles/user.css";
import { useParams } from "react-router";
import api from "../api/auth";
import { AuthContext } from "../../context/AuthContext";
import UserFriendItem from "./UserFriendItem";
import UserSubscribeItem from "./UserSubscribeItem";

const UserLeftSide = ({
  userFriends,
  userSubscribes,
  isOwner,
  setUserFriends,
  setUserSubscribes,
  setNoticeDisplay,
  setNoticeText,
  noticeRef,
}) => {
  //Левая часть страницы пользователя - добаление в друзья, написать сообщение, друзья, подписки
  const auth = useContext(AuthContext);
  //Получение параметров get-запроса, рандомного ключа и функции навигации
  const params = useParams();

  //Инициализация состояний дисплея кнопки, и флага друзья ли пользователь и посетитель его страницы
  const [friendsButtonDisplay, setFriendsButtonDisplay] = useState("block");
  const [isFriends, setIsFriends] = useState(false);
  const [notificationSent, setNotificationSent] = useState(false);

  useEffect(() => {
    //Проверка есть ли пользователь в друзьях у его посетителя
    const user2 = params.id;
    console.log(user2, auth.userId, localStorage.getItem(user2), auth.userId);
    if (!auth.userId) return;
    if (localStorage.getItem(user2) === auth.userId) {
      setFriendsButtonDisplay("none");
    }
  }, [params, auth]);

  //Отправка заявки в друзья
  const makeFriends = async () => {
    //Всплывающая подсказка об отправлении заявки в друзья
    setNoticeDisplay("block");
    setNoticeText("Вы отправили заявку в друзья.");
    noticeRef.current.classList.add("notice-animation");
    //Удаление кнопки добавить в друзья
    setFriendsButtonDisplay("none");
    //Получение ID пользователей
    const user1 = auth.userId;
    const user2 = params.id;
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
  useEffect(() => {
    //Проверка являются ли друзьями пользователь и посетитель его страницы
    const checkFriends = async () => {
      if (!auth.userId) return;
      try {
        //Получение ID пользователей
        const user2 = params.id;
        console.log(auth);
        //Проверка друзей в базе данных
        const response2 = await api.get(`/api/checknotifications/${user2}`, {
          headers: { Authorization: `Bearer ${auth.token}` },
        });
        const response3 = await api.get(`/api/checkfriends/${user2}`, {
          headers: { Authorization: `Bearer ${auth.token}` },
        });
        //Изменение флага являются ли друзьями пользователь и посетитель его страницы
        setIsFriends(response2.data.message);
        setNotificationSent(response3.data.message);
        console.log(isFriends, response2, response3);
      } catch (e) {
        console.log(e);
      }
    };
    checkFriends();
  }, [params, auth]);
  const createRoom = async () => {
    const response = await api.get(`/api/check-rooms/${params.id}`, {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    });
    console.log(response.data.room);
    if (response.data.room) {
      window.location = `/messages/${response.data.room}`;
    } else {
      const response = await api.get(`/api/create-room/${params.id}`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      const response2 = await api.get(`/api/room-by-users/${params.id}`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      if (response.data.err) {
        window.location = `/messages/${response.data.room._id}`;
      } else {
        window.location = `/messages/${response2.data.room._id}`;
      }
    }
  };
  const goToFriends = () => {
    window.location = "/friends/" + params.id;
  };
  const goToSubscribes = () => {
    window.location = "/subscribes/" + params.id;
  };

  return (
    <div className="user-right-side">
      {!isOwner ? (
        <div className="user-actions">
          <button onClick={createRoom} className="user-action dark-button">
            Написать сообщение
          </button>
          {isFriends ? (
            <h3 style={{ color: "white" }}>У вас в друзьях</h3>
          ) : (
            <>
              {notificationSent ? (
                <h3 style={{ color: "white" }}>Вы отправили заявку в друзья</h3>
              ) : (
                <button
                  onClick={makeFriends}
                  className="user-action dark-button"
                  style={{ display: friendsButtonDisplay }}
                >
                  Добавить в друзья
                </button>
              )}
            </>
          )}
        </div>
      ) : (
        <></>
      )}
      <div className="user-lists">
        <div className="user-friends block">
          <p className="user-friends-title" onClick={goToFriends}>
            Друзья {userFriends.length}
          </p>
          <div className="user-friends-list">
            {userFriends.slice(0, 9).map((el) => (
              <UserFriendItem
                el={el}
                isOwner={isOwner}
                setUserFriends={setUserFriends}
                userFriends={userFriends}
                setNoticeDisplay={setNoticeDisplay}
                setNoticeText={setNoticeText}
                noticeRef={noticeRef}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="user-friends block">
        <p className="user-friends-title" onClick={goToSubscribes}>
          Подписки {userSubscribes.length}
        </p>
        <div className="user-friends-list">
          {userSubscribes.slice(0, 3).map((el) => (
            <UserSubscribeItem
              el={el}
              isOwner={isOwner}
              setUserSubscribes={setUserSubscribes}
              userSubscribes={userSubscribes}
              setNoticeDisplay={setNoticeDisplay}
              setNoticeText={setNoticeText}
              noticeRef={noticeRef}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserLeftSide;
