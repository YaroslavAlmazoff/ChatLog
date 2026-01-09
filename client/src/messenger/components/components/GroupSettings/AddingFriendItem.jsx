import { useContext } from "react";
import { AuthContext } from "../../../../context/AuthContext";
import { GroupContext } from "../../../context/GroupContext";
import "../../../styles/GroupMember.css";
import "../../../../auth/styles/user-item.css";

export default function AddingFriendItem({ friend }) {
  const { userId } = useContext(AuthContext);
  const { room, exclude, invite } = useContext(GroupContext);

  const isAdded = room.members.some((m) => m._id === friend._id);

  const goToMember = () => {
    window.location = `/user/${friend._id}`;
  };

  return (
    <div onClick={goToMember} className="user-item">
      <div className="user-item-right-side group-member">
        <div>
          <img
            className="user-item-img"
            src={
              process.env.REACT_APP_API_URL + "/useravatars/" + friend.avatarUrl
            }
            alt="user"
          />
        </div>
        <div className="user-item-info">
          <h3 className="user-item-name">
            {friend.name} {friend.surname}
          </h3>
        </div>
        {userId !== room.creator ? (
          <button className="button ml" onClick={(e) => invite(e, friend)}>
            Добавить
          </button>
        ) : (
          <>
            {isAdded ? (
              <button
                className="button-neon-red ml"
                onClick={(e) => exclude(e, friend._id)}
              >
                Исключить
              </button>
            ) : (
              <button className="button ml" onClick={(e) => invite(e, friend)}>
                Добавить
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
