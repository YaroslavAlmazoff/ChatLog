import useRandom from "../../common_hooks/random.hook";
import useWord from "../../common_hooks/divideWord.hook";
import useFiles from "../../common_hooks/files.hook";
import api from "../api/auth";
import { AuthContext } from "../../context/AuthContext";
import { useContext, useEffect, useState } from "react";
import ModalWindow from "../../common_components/modal-window/ModalWindow";

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

  const goToPublic = () => {
    window.location = `/user/${el._id}`;
  };
  //Удаление из друзей
  const unscribe = async () => {
    const response = await api.get(`/api/public/subscribe/${el._id}`, {
      headers: { Authorization: `Bearer ${auth.token}` },
    });
    console.log(response);
    setUserSubscribes((prev) =>
      [...prev].filter((item) => item._id !== el._id)
    );
    setNoticeDisplay("block");
    setNoticeText("Вы отписались");
    noticeRef.current.classList.add("notice-animation");
  };
  const onConfirm = () => {
    unscribe();
  };
  return (
    <div key={randomKey()} onClick={goToPublic} className="user-subscribe">
      <ModalWindow
        isOpen={auth.isOpen}
        onClose={auth.closeWindow}
        onConfirm={onConfirm}
        text={`Вы действительно хотите отписаться от группы ${el.name}?`}
      />
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
        <p title="Отписаться" className="unscribe" onClick={auth.openWindow}>
          &times;
        </p>
      ) : (
        <></>
      )}
    </div>
  );
};

export default UserSubscribeItem;
