import useRandom from "../../common_hooks/random.hook";
import useWord from "../../common_hooks/divideWord.hook";
import useFiles from "../../common_hooks/files.hook";
import api from "../api/auth";
import { AuthContext } from "../../context/AuthContext";
import { useContext, useState } from "react";
import ModalWindow from "../../common_components/modal-window/ModalWindow";
import { ProfileContext } from "../context/ProfileContext";

const UserSubscribeItem = ({ subscribe }) => {
  const { token } = useContext(AuthContext);
  const { divideWord } = useWord();
  const { randomKey } = useRandom();
  const { hint, isOwner, subscribes, setSubscribes } =
    useContext(ProfileContext);
  const [showModal, setShowModal] = useState(false);

  const goToPublic = () => {
    window.location = `/public/${el._id}`;
  };

  const unsubscribe = async () => {
    const response = await api.post(
      `/api/public/subscribe/${subscribe._id}`,
      { showedSubscribes: subscribes },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setSubscribes((prev) => {
      const newSubscribes = [...prev].filter((el) => el._id !== subscribe._id);
      if (response.data.newSubscribe) {
        return [...newSubscribes, response.data.newSubscribe];
      } else return newSubscribes;
    });
    hint("Вы отписались");
  };

  const onConfirm = () => {
    setShowModal(false);
    unsubscribe();
  };

  return (
    <div key={randomKey()} onClick={goToPublic} className="user-subscribe">
      <CommonModal show={showModal} onClose={() => setShowModal(false)}>
        <span>
          Вы действительно хотите отписаться от группы {subscribe.name}?
        </span>
        <div className="fl">
          <button className="button-neon-red" onClick={onConfirm}>
            Отписаться
          </button>
          <span className="cancel-button">Отмена</span>
        </div>
      </CommonModal>
      <img
        className="user-friend-avatar block"
        src={
          el.avatarUrl
            ? process.env.REACT_APP_API_URL +
              "/publicavatars/" +
              subscribe.avatarUrl
            : require("../../publics/img/group.png")
        }
        alt="friend"
      />
      <p className="user-subscribe-name">{divideWord(subscribe.name, 25)}</p>
      {isOwner ? (
        <p
          title="Отписаться"
          className="unscribe"
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
    </div>
  );
};

export default UserSubscribeItem;
