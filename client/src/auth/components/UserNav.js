import { useRef, useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ProfileContext } from "../context/ProfileContext";
import useDate from "../../common_hooks/date.hook";
import useHighlight from "../../common_hooks/highlight.hook";
import api from "../api/auth";
import "../styles/user.css";

const UserNav = () => {
  const { randomColor } = useHighlight();
  const { calculateAge } = useDate();
  const { isOwner, user } = useContext(ProfileContext);
  const avatarFileRef = useRef();
  const bannerFileRef = useRef();

  const auth = useContext(AuthContext);

  const [avatarUrl, setAvatarUrl] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [aboutMeDisplaying, setAboutMeDisplaying] = useState(false);

  useEffect(() => {
    setAvatarUrl(user.avatarUrl);
    setBannerUrl(user.bannerUrl);
  }, []);

  const openAvatarSelect = () => {
    if (isOwner) {
      avatarFileRef.current.click();
    }
  };
  const openBannerSelect = () => {
    bannerFileRef.current.click();
  };

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
      setAvatarUrl(JSON.parse(response.data).avatarUrl);
    } else if (type === "banner") {
      setBannerUrl(JSON.parse(response.data).bannerUrl);
    }
  };

  const arrow = useRef(null);

  const openAboutMe = () => {
    if (!aboutMeDisplaying) {
      if (
        arrow.current.classList.value.includes(
          "user-nav-more-info-backward-animation"
        )
      ) {
        arrow.current.classList.remove("user-nav-more-info-backward-animation");
      }
      setAboutMeDisplaying(true);
      arrow.current.classList.add("user-nav-more-info-forward-animation");
    } else {
      if (
        arrow.current.classList.value.includes(
          "user-nav-more-info-forward-animation"
        )
      ) {
        arrow.current.classList.remove("user-nav-more-info-forward-animation");
      }
      setAboutMeDisplaying(false);
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
                process.env.REACT_APP_API_URL + "/userbanners/" + bannerUrl
              })`,
            }
      }
    >
      {isOwner && (
        <span className="user-change-banner" onClick={openBannerSelect}>
          Изменить баннер
        </span>
      )}
      <img
        className="user-avatar block"
        src={process.env.REACT_APP_API_URL + "/useravatars/" + avatarUrl}
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
        {aboutMeDisplaying ? (
          <div className="about-me">
            {user.aboutMe ? (
              <span className="about-me-text">{user.aboutMe}</span>
            ) : (
              <p>Информация о себе отсутствует.</p>
            )}
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default UserNav;
