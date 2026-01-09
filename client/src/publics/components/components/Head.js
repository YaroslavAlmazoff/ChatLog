import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../../context/AuthContext";
import api from "../../../auth/api/auth";
import "../../styles/head.css";

const Head = ({
  pub,
  isAdmin,
  subscribers,
  setSubscribers,
  isNotifications,
  setIsNotifications,
}) => {
  const auth = useContext(AuthContext);
  const [buttonText, setButtonText] = useState("+ Подписаться");

  useEffect(() => {
    if (!auth.userId || !pub._id) return;
    const getIsSubscriber = async () => {
      const response = await api.get(`/api/public/issubscriber/${pub._id}`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      if (response.data.isSubscriber) {
        setButtonText("Отписаться");
      } else {
        setButtonText("+ Подписаться");
      }
    };
    getIsSubscriber();
  }, [pub, auth]);

  const writeArticle = () => {
    window.location = `/createpublicpost/${pub._id}`;
  };
  const edit = () => {
    window.location = `/editpublic/${pub._id}`;
  };
  const notifications = () => {
    setIsNotifications(!isNotifications);
  };
  const subscribe = async () => {
    const response = await api.get(`/api/public/subscribe/${pub._id}`, {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    });
    if (response.data.isSubscriber) {
      setSubscribers([auth.userId, ...subscribers]);
      setButtonText("Отписаться");
    } else {
      setSubscribers([...subscribers].filter((el) => el !== auth.userId));
      setButtonText("+ Подписаться");
    }
  };

  return (
    <div
      className="public-head block"
      style={{
        backgroundImage: `url(${
          process.env.REACT_APP_API_URL + `/publicbanners/` + pub.bannerUrl
        })`,
      }}
    >
      <div className="public-info">
        <div className="public-top-info">
          {pub.avatarUrl ? (
            <img
              className="public-avatar block"
              src={
                process.env.REACT_APP_API_URL +
                `/publicavatars/` +
                pub.avatarUrl
              }
              alt="avatar"
            />
          ) : (
            <img
              className="public-avatar"
              src={require("../../img/group.png")}
              alt="нету аватарки"
            />
          )}
          <p className="public-description">{pub.description}</p>
        </div>
        <div className="public-bottom-info">
          <p className="public-name">{pub.name}</p>
          {!isAdmin ? (
            <button onClick={subscribe} className="button">
              {buttonText}
            </button>
          ) : (
            <div></div>
          )}
        </div>
      </div>
      {isAdmin ? (
        <div className="public-actions">
          <div onClick={writeArticle} className="public-action">
            <img
              className="public-action-img"
              src={require("../../img/article.png")}
              alt="article"
            />
            <p className="public-action-name">Новая статья</p>
          </div>
          <div
            onClick={edit}
            className="public-action"
            style={{ marginLeft: "-10px" }}
          >
            <img
              className="public-action-img"
              src={require("../../img/pencil.png")}
              alt="edit"
            />
            <p className="public-action-name">Редактировать</p>
          </div>
          <div
            onClick={notifications}
            className="public-action"
            style={{ marginLeft: "-8px" }}
          >
            <img
              className="public-action-img"
              src={require("../../img/notifications.png")}
              alt="notifications"
            />
            <p className="public-action-name">Уведомления</p>
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default Head;
