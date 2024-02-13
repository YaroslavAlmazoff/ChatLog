import React, { useRef, useState, useContext } from "react";
import "../styles/user.css";
import Notice from "./Notice";
import useDate from "../../common_hooks/date.hook";
import api from "../api/auth";
import { AuthContext } from "../../context/AuthContext";

const UserNav = ({
  user,
  isOwner,
  noticeDisplay,
  setNoticeDisplay,
  noticeText,
  noticeRef,
}) => {
  const [colors] = useState([
    "color-neon-blue",
    "color-neon-orange",
    "color-neon-green",
    "color-neon-purple",
    "color-neon-pink",
    "color-neon-navy",
  ]);
  const { calculateAge } = useDate();
  const avatarFileRef = useRef();
  const avatarRef = useRef();
  const bannerFileRef = useRef();
  const bannerRef = useRef();

  const auth = useContext(AuthContext);

  const openAvatarSelect = () => {
    avatarFileRef.current.click();
  };
  const openBannerSelect = () => {
    bannerFileRef.current.click();
  };

  //Получение файла фотографии пользователя
  const sendMedia = async (e, type) => {
    let file = e.target.files[0];
    const formData = new FormData();
    formData.append(type, file);
    formData.append(`${type}Exists`, true);
    formData.append(type === "avatar" ? "banner" : "avatar", null);
    formData.append(`${type === "avatar" ? "banner" : "avatar"}Exists`, false);
    const response = await api.post("/api/update-images", formData, {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    });
    if (type === "avatar") {
      avatarRef.current.src =
        process.env.REACT_APP_API_URL +
        "/useravatars/" +
        JSON.parse(response.data).avatarUrl;
    } else if (type === "banner") {
      bannerRef.current.style.backgroundImage = `url(${
        process.env.REACT_APP_API_URL +
        "/userbanners/" +
        JSON.parse(response.data).bannerUrl
      })`;
    }
  };

  const randomColor = () => {
    return colors[Math.round(Math.random() * colors.length)];
  };
  const arrow = useRef(null);
  const [aboutMeDisplay, setAboutMeDisplay] = useState("none");
  const gotoEdit = () => {
    window.location = `/editprofile`;
  };
  const openAboutMe = () => {
    if (aboutMeDisplay === "none") {
      if (
        arrow.current.classList.value.includes(
          "user-nav-more-info-backward-animation"
        )
      ) {
        arrow.current.classList.remove("user-nav-more-info-backward-animation");
      }
      setAboutMeDisplay("inline");
      arrow.current.classList.add("user-nav-more-info-forward-animation");
    } else {
      if (
        arrow.current.classList.value.includes(
          "user-nav-more-info-forward-animation"
        )
      ) {
        arrow.current.classList.remove("user-nav-more-info-forward-animation");
      }

      setAboutMeDisplay("none");
      arrow.current.classList.add("user-nav-more-info-backward-animation");
    }
  };
  return (
    <div
      className="user-nav block"
      ref={bannerRef}
      style={
        user.bannerUrl === "banner.jpg"
          ? { backgroundColor: "transparent" }
          : {
              backgroundImage: `url(${
                process.env.REACT_APP_API_URL + "/userbanners/" + user.bannerUrl
              })`,
            }
      }
    >
      <span className="user-change-banner" onClick={openBannerSelect}>
        Изменить баннер
      </span>
      <Notice
        noticeDisplay={noticeDisplay}
        setNoticeDisplay={setNoticeDisplay}
        noticeText={noticeText}
        noticeRef={noticeRef}
      />
      <img
        className="user-avatar block"
        ref={avatarRef}
        src={process.env.REACT_APP_API_URL + "/useravatars/" + user.avatarUrl}
        onClick={openAvatarSelect}
        alt="useravatar"
      />
      <input
        onChange={(e) => sendMedia(e, "avatar")}
        ref={avatarFileRef}
        type="file"
      />
      <input
        onChange={(e) => sendMedia(e, "banner")}
        ref={bannerFileRef}
        type="file"
      />
      <div className="banner">
        <div className="user-nav-info">
          <h2 className={`user-name ${randomColor()} navy-text-glow`}>
            {user.name} {user.surname}
            {user.age && <>, {calculateAge(user.age) + " лет"}</>}
          </h2>
          <div className="user-more-info-container" onClick={openAboutMe}>
            <span className="user-more-info-title">
              Информация о пользователе
            </span>
            <img
              ref={arrow}
              className="user-nav-more-info"
              src={require("../img/arrow1.png")}
              alt="arrow"
            />
          </div>
        </div>
        <div className="about-me" style={{ display: aboutMeDisplay }}>
          {user.aboutMe ? (
            <h3 className="about-me-text">{user.aboutMe}</h3>
          ) : (
            <p>Информация о себе отсутствует.</p>
          )}
        </div>
        <div className="user-nav-actions">
          {isOwner ? (
            <button onClick={gotoEdit} className="button">
              Редактировать профиль
            </button>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserNav;
