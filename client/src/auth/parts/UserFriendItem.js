import useRandom from "../../common_hooks/random.hook";
import useWord from "../../common_hooks/divideWord.hook";
import useFiles from "../../common_hooks/files.hook";
import api from "../api/auth";
import { AuthContext } from "../../context/AuthContext";
import { useContext, useEffect, useState } from "react";
import ModalWindow from "../../common_components/modal-window/ModalWindow";

const UserFriendItem = ({
  el,
  isOwner,
  setUserFriends,
  userFriends,
  setNoticeDisplay,
  setNoticeText,
  noticeRef,
}) => {
  const auth = useContext(AuthContext);
  const { divideWord } = useWord();
  const { randomKey } = useRandom();
  const [modal, setModal] = useState(false);

  const openWindow = () => {
    setModal(true);
    auth.darkScreen(true);
  };
  const closeWindow = () => {
    setModal(false);
    auth.darkScreen(false);
  };

  const gotoFriend = (id) => {
    window.location = `/user/${id}`;
  };
  //Удаление из друзей
  const deleteFriend = async (id) => {
    //Изменение списка друзей пользователя
    setUserFriends([...userFriends].filter((el) => el._id !== id));
    //Всплывающая подсказка
    setNoticeDisplay("block");
    setNoticeText("Вы удалили этого пользователя из друзей.");
    noticeRef.current.classList.add("notice-animation");
    //Получение ID пользователей
    const user2 = id;
    //Удаление из друзей
    const response = await api.delete(`/api/deletefriend/${user2}`, {
      headers: { Authorization: `Bearer ${auth.token}` },
    });
    localStorage.removeItem("user2");
    console.log(response);
  };
  const onConfirm = () => {
    deleteFriend(el._id);
  };
  return (
    <div
      key={randomKey()}
      onClick={() => gotoFriend(el._id)}
      className="user-friend"
    >
      {modal && (
        <ModalWindow
          isOpen={modal}
          onClose={closeWindow}
          onConfirm={onConfirm}
          text={`Вы действительно хотите удалить пользователя ${el.name} из друзей?`}
        />
      )}
      {isOwner ? (
        <p
          title="Удалить из друзей?"
          className="delete-friend"
          onClick={(e) => {
            e.stopPropagation();
            openWindow();
          }}
        >
          &times;
        </p>
      ) : (
        <></>
      )}
      <img
        className="user-friend-avatar block"
        src={process.env.REACT_APP_API_URL + "/useravatars/" + el.avatarUrl}
        alt="friend"
      />
      <p className="user-friend-name">{divideWord(el.name, 25)}</p>
    </div>
  );
};

export default UserFriendItem;
