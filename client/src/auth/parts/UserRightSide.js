import React, { useEffect, useState } from "react";
import ImagePreview2 from "./ImagePreview2";
import useRandom from "../../common_hooks/random.hook";
import "../styles/user.css";
import { useParams } from "react-router";
import FotoItem from "./FotoItem";
import useDate from "../../common_hooks/date.hook";
import api from "../api/auth";

const UserRightSide = ({
  getFile2,
  fileRef2,
  emitOpen2,
  imagePreviewUrl2,
  imagePreviewDisplay2,
  sendFoto,
  userFotos,
  file2,
  setUserFotos,
  isOwner,
  showNotifications,
  notificationRef,
}) => {
  const [notifications, setNotifications] = useState([
    {
      checked: false,
    },
  ]);
  const params = useParams();
  const { getCurrentDate } = useDate();
  //Правая часть страницы пользователя - добавление фотографий и список фотографий
  const { randomKey } = useRandom();
  const showFotography = (img) => {
    window.location = `/fotography/${img}`;
  };
  useEffect(() => {
    const getNotifications = async () => {
      const response = await api.get(`/api/getnotifications/${params.id}`);
      setNotifications(response.data.notifications);
    };
    getNotifications();
  }, [params]);
  const deleteFoto = async (url) => {
    await api.delete(`/api/deleteuserfoto/${url}`);
    setUserFotos((prev) => prev.filter((foto) => foto.imageUrl !== url));
  };
  return (
    <div className="user-left-side">
      {isOwner ? (
        <div>
          <div ref={notificationRef}>
            {notifications.length !== 0 ? (
              <div>
                {!notifications[notifications.length - 1].checked ? (
                  <div
                    style={{
                      width: "60px",
                      backgroundColor: "red",
                      borderRadius: "15px",
                      marginBottom: "-30px",
                      zIndex: "10",
                      color: "white",
                    }}
                  >
                    <p>Новые</p>
                  </div>
                ) : (
                  <></>
                )}
              </div>
            ) : (
              <></>
            )}
            <img
              className="notice-img"
              onClick={showNotifications}
              width="35"
              src={require("../img/notice.png")}
              alt="notice"
            />
          </div>
          <input onChange={(e) => getFile2(e)} ref={fileRef2} type="file" />
          <button
            onClick={(e) => emitOpen2(e)}
            className="user-add-foto-right button"
          >
            Добавить фотографию
          </button>
          <button
            onClick={() => sendFoto(file2, userFotos, setUserFotos)}
            className="user-add-foto-right button"
          >
            Отправить фотографию
          </button>
          <ImagePreview2
            imagePreviewUrl2={imagePreviewUrl2}
            imagePreviewDisplay2={imagePreviewDisplay2}
          />
        </div>
      ) : (
        <></>
      )}
      <div className="user-fotos">
        <p className="user-fotos-title">Фотографии {userFotos.length}</p>
        {userFotos.map((el) => (
          <div className="foto-div" key={randomKey()}>
            <FotoItem item={el} />
            <span onClick={() => deleteFoto(el.imageUrl)}>Удалить</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserRightSide;
