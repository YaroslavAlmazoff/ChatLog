import React, { useRef, useState, useEffect } from "react";
import "../styles/user.css";
import Notice from "./Notice";
import useDate from "../../common_hooks/date.hook";
import api from "../api/auth";

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

  const openAvatarSelect = () => {
    avatarFileRef.current.click();
  };

  //Получение файла фотографии пользователя
  const getAvatar = async (e) => {
    let file = e.target.files[0];
    const formData = new FormData();
    formData.append("avatar", file);
    formData.append("avatarExists", true);
    formData.append("banner", null);
    formData.append("bannerExists", false);
    const response = await api.post("update-images", formData, {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    });
    avatarRef.current.src =
      process.env.REACT_APP_API_URL + "/useravatars/" + response.data.avatarUrl;
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
      <Notice
        noticeDisplay={noticeDisplay}
        setNoticeDisplay={setNoticeDisplay}
        noticeText={noticeText}
        noticeRef={noticeRef}
      />
      <img
        className="user-avatar block"
        src={process.env.REACT_APP_API_URL + "/useravatars/" + user.avatarUrl}
        onClick={openAvatarSelect}
        alt="useravatar"
      />
      <input onChange={(e) => getAvatar(e)} ref={avatarFileRef} type="file" />
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
