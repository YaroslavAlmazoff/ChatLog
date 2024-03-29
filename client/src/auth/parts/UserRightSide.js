import React, { useContext, useEffect, useState } from "react";
import ImagePreview2 from "./ImagePreview2";
import useRandom from "../../common_hooks/random.hook";
import "../styles/user.css";
import { useParams } from "react-router";
import FotoItem from "./FotoItem";
import api from "../api/auth";

const UserRightSide = ({
  getFile2,
  fileRef2,
  emitOpen2,
  imagePreviewUrl2,
  imagePreviewDisplay2,
  setImagePreviewDisplay2,
  setImagePreviewUrl2,
  sendFoto,
  userFotos,
  file2,
  setFile2,
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
  const [publishButtonDisplay, setPublishButtonDisplay] = useState(false);
  const params = useParams();
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
  const uploadPhoto = (e) => {
    emitOpen2(e);
  };
  const getPhoto = (e) => {
    getFile2(e);
    setPublishButtonDisplay(true);
  };
  const cancelUploadPhoto = () => {
    setPublishButtonDisplay(false);
    setImagePreviewDisplay2("none");
    setImagePreviewUrl2("");
    setFile2("");
  };
  return (
    <div className="user-left-side">
      {isOwner ? (
        <div>
          <div ref={notificationRef} className="notice-container">
            <img
              className={`${
                notifications.length !== 0 &&
                !notifications[notifications.length - 1].checked
                  ? "button-neon-red red-block-glow"
                  : "button blue-block-glow"
              } notice-img `}
              onClick={showNotifications}
              width="35"
              src={require("../img/notice.png")}
              alt="notice"
            />
            {!publishButtonDisplay && (
              <button
                onClick={(e) => uploadPhoto(e)}
                className="user-add-foto-right button"
              >
                Добавить фотографию
              </button>
            )}
            {publishButtonDisplay && (
              <>
                <button
                  onClick={() => sendFoto(file2, userFotos, setUserFotos)}
                  className="user-add-foto-right button"
                >
                  Опубликовать
                </button>
                <span
                  className="upload-photo-cancel"
                  onClick={cancelUploadPhoto}
                >
                  Отмена
                </span>
              </>
            )}
          </div>
          <input onChange={(e) => getPhoto(e)} ref={fileRef2} type="file" />

          <br />
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
          <FotoItem
            key={randomKey()}
            item={el}
            deleteFoto={deleteFoto}
            isOwner={isOwner}
          />
        ))}
      </div>
    </div>
  );
};

export default UserRightSide;
