import React, { useContext, useEffect, useState } from "react";
import "../styles/user-item.css";
import api from "../api/auth";
import { AuthContext } from "../../context/AuthContext";
import useHighlight from "../../common_hooks/highlight.hook";
import useDate from "../../common_hooks/date.hook";
import useWord from "../../common_hooks/divideWord.hook";

const UserItem = ({ index, style, data }) => {
  const { calculateAge, formatAge, catchNaN } = useDate();
  const { divideWord } = useWord();
  const [friendsRequestSent, setFriendsRequestSent] = useState(
    data.users[index].isRequest
  );
  const auth = useContext(AuthContext);
  const { randomColor, randomShadow, randomBlockShadow } = useHighlight();
  //Предпросмотр пользователя на странице со всеми пользователями
  //Перемещение на страницу пользователя
  const gotoUser = () => {
    window.location = `/user/${data.users[index]._id}`;
  };

  const createRoom = async (e) => {
    e.stopPropagation();
    const response = await api.get(`/api/checkrooms/${data.users[index]._id}`, {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    });
    if (response.data.room) {
      window.location = `/messages/${response.data.room}`;
    } else {
      await api.get(`/api/createroom/${data.users[index]._id}`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      const response2 = await api.get(`/api/getroom/${data.users[index]._id}`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      window.location = `/messages/${response2.data.room._id}`;
    }
  };
  const makeFriends = async (e) => {
    e.stopPropagation();
    await api.get(`/api/makefriends/${data.users[index]._id}`, {
      headers: { Authorization: `Bearer ${auth.token}` },
    });
    setFriendsRequestSent(true);
  };
  const calcelFriendsRequest = async (e) => {
    e.stopPropagation();
    await api.delete(`/api/cancel-friends-request/${data.users[index]._id}`, {
      headers: { Authorization: `Bearer ${auth.token}` },
    });
    setFriendsRequestSent(false);
  };
  return (
    <div onClick={gotoUser} className={`user-item ${randomBlockShadow()}`}>
      <div className="user-item-right-side">
        <div>
          <img
            className={`user-item-img ${randomBlockShadow()}`}
            src={
              process.env.REACT_APP_API_URL +
              "/useravatars/" +
              data.users[index].avatarUrl
            }
            alt="user"
          />
        </div>
        <div className="user-item-info">
          <h3 className={`user-item-name ${randomColor()} ${randomShadow()}`}>
            {divideWord(
              data.users[index].name + " " + data.users[index].surname,
              25
            )}
          </h3>
          <p className="user-item-age">
            {formatAge(catchNaN(calculateAge(data.users[index].age)))}
          </p>
        </div>
      </div>
      <div>
        {data.users[index]._id !== auth.userId ? (
          <div className="user-item-actions">
            {data.users[index].isFriends ? (
              <button
                onClick={(e) => createRoom(e)}
                className="button"
                style={{ marginBottom: "5px" }}
              >
                Написать сообщение
              </button>
            ) : (
              <>
                {friendsRequestSent ? (
                  <span
                    onClick={(e) => calcelFriendsRequest(e)}
                    className="user-item-request-sent"
                  >
                    Отменить заявку
                  </span>
                ) : (
                  <button onClick={(e) => makeFriends(e)} className="button">
                    Добавить в друзья
                  </button>
                )}
              </>
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
