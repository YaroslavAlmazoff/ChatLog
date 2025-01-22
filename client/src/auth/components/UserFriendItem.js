import useRandom from "../../common_hooks/random.hook";
import useWord from "../../common_hooks/divideWord.hook";
import api from "../api/auth";
import { AuthContext } from "../../context/AuthContext";
import { useContext, useState } from "react";
import { ProfileContext } from "../context/ProfileContext";
import CommonModal from "../../common_components/Modal/CommonModal";

const UserFriendItem = ({ friend }) => {
  const auth = useContext(AuthContext);
  const { hint, isOwner, friends, setFriends } = useContext(ProfileContext);
  const { divideWord } = useWord();
  const { randomKey } = useRandom();
  const [showModal, setShowModal] = useState(false);

  const goToFriend = () => {
    window.location = `/user/${friend._id}`;
  };

  const deleteFriend = async () => {
    const response = await api.delete(
      `/api/remove-friend/${friend._id}`,
      { showedFriends: friends },
      {
        headers: { Authorization: `Bearer ${auth.token}` },
      }
    );
    setFriends((prev) => {
      const newFriends = [...prev].filter((el) => el._id !== friend._id);
      if (response.data.newFriend) {
        return [...newFriends, response.data.newFriend];
      } else return newFriends;
    });
    hint("Вы удалили этого пользователя из друзей.");
  };

  const onConfirm = () => {
    setShowModal(false);
    deleteFriend(friend._id);
  };
  return (
    <div
      key={randomKey()}
      onClick={() => goToFriend(friend._id)}
      className="user-friend"
    >
      <CommonModal show={showModal} onClose={() => setShowModal(false)}>
        <span>
          Вы действительно хотите удалить пользователя {friend.name} из друзей?
        </span>
        <div className="fl">
          <button className="button-neon-red" onClick={onConfirm}>
            Удалить
          </button>
          <span className="cancel-button" onClick={() => setShowModal(false)}>
            Отмена
          </span>
        </div>
      </CommonModal>
      {isOwner ? (
        <p
          title="Удалить из друзей?"
          className="delete-friend"
          onClick={(e) => {
            e.stopPropagation();
            setShowModal(true);
          }}
        >
          &times;
        </p>
      ) : (
        <></>
      )}
      <img
        className="user-friend-avatar block"
        src={process.env.REACT_APP_API_URL + "/useravatars/" + friend.avatarUrl}
        alt="friend"
      />
      <p className="user-friend-name">{divideWord(friend.name, 25)}</p>
    </div>
  );
};

export default UserFriendItem;
