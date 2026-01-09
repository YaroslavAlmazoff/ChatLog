import api from "../../../../auth/api/auth";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../../../context/AuthContext";
import "../../../styles/public-item.css";
import useHighlight from "../../../../common_hooks/highlight.hook";

const Public = ({ item }) => {
  const auth = useContext(AuthContext);
  const [buttonText, setButtonText] = useState("+ Подписаться");
  const { randomBlockShadow, randomShadow, randomColor } = useHighlight();

  useEffect(() => {
    if (!auth.userId || !item._id) return;
    const getIsSubscriber = async () => {
      const response = await api.get(`/api/public/issubscriber/${item._id}`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      if (!response.data.isSubscriber) {
        setButtonText("+ Подписаться");
      } else {
        setButtonText("Отписаться");
      }
    };
    getIsSubscriber();
  }, [item, auth]);

  const subscribe = async (e) => {
    e.stopPropagation();
    const response = await api.get(`/api/public/subscribe/${item._id}`, {
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
  const gotoPublic = () => {
    window.location = `/public/${item._id}`;
  };

  return (
    <div className={`public-item ${randomBlockShadow()}`} onClick={gotoPublic}>
      <div className="public-item-info">
        {item.avatarUrl ? (
          <img
            className={`public-item-avatar ${randomBlockShadow()}`}
            src={
              process.env.REACT_APP_API_URL + `/publicavatars/` + item.avatarUrl
            }
            alt="public avatar"
          />
        ) : (
          <img
            className={`public-item-avatar ${randomBlockShadow()}`}
            src={require("../../../img/group.png")}
            alt="group"
          />
        )}

        <p className={`public-item-name ${randomColor()} ${randomShadow()}`}>
          {item.name}
        </p>
      </div>
      <button onClick={(e) => subscribe(e)} className="button">
        {buttonText}
      </button>
    </div>
  );
};

export default Public;
