import useRandom from "../../common_hooks/random.hook";
import useWord from "../../common_hooks/divideWord.hook";
import useFiles from "../../common_hooks/files.hook";
import api from "../api/auth";
import { AuthContext } from "../../context/AuthContext";
import { useContext, useEffect, useState } from "react";

const UserSubscribeItem = ({
  el,
  isOwner,
  setUserSubscribes,
  userSubscribers,
  setNoticeDisplay,
  setNoticeText,
  noticeRef,
}) => {
  const auth = useContext(AuthContext);
  const { divideWord } = useWord();
  const { randomKey } = useRandom();

  const goToPublic = (id) => {
    window.location = `/user/${id}`;
  };
  //Удаление из друзей
  const unscribe = async (id) => {
    const response = await api.get(`/api/public/subscribe/${el._id}`, {
      headers: { Authorization: `Bearer ${auth.token}` },
    });
    console.log(response);
    setUserSubscribes((prev) => [...prev].filter((el) => el._id !== id));
    setNoticeDisplay("block");
    setNoticeText("Вы отписались");
    noticeRef.current.classList.add("notice-animation");
  };
  return (
    <div
      key={randomKey()}
      onClick={() => goToPublic(el._id)}
      className="user-subscribe"
    >
      <img
        className="user-friend-avatar block"
        src={
          el.avatarUrl
            ? process.env.REACT_APP_API_URL + "/publicavatars/" + el.avatarUrl
            : require("../../publics/img/group.png")
        }
        alt="friend"
      />
      <p className="user-subscribe-name">{divideWord(el.name, 25)}</p>
      {isOwner ? (
        <p
          title="Отписаться"
          className="unscribe"
          onClick={() => unscribe(el._id)}
        >
          &times;
        </p>
      ) : (
        <></>
      )}
    </div>
  );
};

export default UserSubscribeItem;
