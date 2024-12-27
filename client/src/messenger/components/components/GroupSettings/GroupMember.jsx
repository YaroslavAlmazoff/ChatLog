import { useContext } from "react";
import { AuthContext } from "../../../../context/AuthContext";
import "../../../styles/GroupMember.css";
import "../../../../auth/styles/user-item.css";
import { GroupContext } from "../../../context/GroupContext";

export default function GroupMember({ member }) {
  const { userId } = useContext(AuthContext);
  const { exclude } = useContext(GroupContext);

  const goToMember = () => {
    window.location = `/user/${id}`;
  };

  return (
    <div onClick={goToMember} className="user-item">
      <div className="user-item-right-side">
        <div>
          <img
            className="user-item-img"
            src={
              process.env.REACT_APP_API_URL + "/useravatars/" + member.avatarUrl
            }
            alt="user"
          />
        </div>
        <div className="user-item-info">
          <h3 className="user-item-name">
            {member.name} {member.surname}
          </h3>
        </div>
        {userId == room.creator ? (
          <button
            className="button-neon-red"
            onClick={(e) => exclude(e, member._id)}
          >
            Исключить
          </button>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
