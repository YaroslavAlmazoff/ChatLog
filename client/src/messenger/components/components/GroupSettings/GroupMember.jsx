import { useContext } from "react";
import { AuthContext } from "../../../../context/AuthContext";
import { GroupContext } from "../../../context/GroupContext";
import "../../../styles/GroupMember.css";
import "../../../../auth/styles/user-item.css";

export default function GroupMember({ member }) {
  const { userId } = useContext(AuthContext);
  const { room, exclude } = useContext(GroupContext);

  const goToMember = () => {
    window.location = `/user/${member._id}`;
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
