import React, { useContext, useEffect, useState } from "react";
import "../../../auth/styles/user-item.css";
import api from "../../../auth/api/auth";
import { AuthContext } from "../../../context/AuthContext";
import useFiles from "../../../common_hooks/files.hook";
import "../../styles/recipients-list.css";
import useHighlight from "../../../common_hooks/highlight.hook";

const LinkRecipientItem = ({ item, file }) => {
  const { randomBlockShadow, randomColor, randomShadow } = useHighlight();
  useEffect(() => {
    console.log(item);
  }, []);
  const auth = useContext(AuthContext);
  //Предпросмотр пользователя на странице со всеми пользователями
  //Перемещение на страницу пользователя
  const createRoom = async () => {
    const response = await api.get(`/api/check-rooms/${item._id}`, {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    });
    if (response.data.room) {
      return response;
    } else {
      await api.get(`/api/create-room/${item._id}`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      const response = await api.get(`/api/get-room-id/${item._id}`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      return response;
    }
  };
  const sendLink = () => {
    createRoom().then(async (data) => {
      await api.get(`/api/cloud/publicfile/${file._id}`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      const link = `http://chatlog.ru/cloud/file/${file._id}`;
      console.log(link);
      localStorage.setItem("file-link", link);
      window.location = `/messages/${data.data.room}`;
    });
  };
  return (
    <div>
      {item._id !== auth.userId ? (
        <div
          onClick={sendLink}
          className={`recipient-item ${randomBlockShadow()}`}
        >
          <div className="recipient-item-right-side">
            <div>
              <img
                className={`recipient-item-img ${randomBlockShadow()}`}
                src={
                  process.env.REACT_APP_API_URL +
                  `/useravatars/` +
                  item.avatarUrl
                }
                alt="user"
              />
            </div>
            <div className="recipient-item-info">
              <h3 className={`${randomColor()} ${randomShadow()}`}>
                {item.name} {item.surname}
              </h3>
              <p className={`${randomColor()} ${randomShadow()}`}>{item.age}</p>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default LinkRecipientItem;
