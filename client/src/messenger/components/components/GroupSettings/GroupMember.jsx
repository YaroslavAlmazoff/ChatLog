import { useContext } from "react";
import { AuthContext } from "../../../../context/AuthContext";
import "../../../styles/GroupMember.css";
import "../../../../auth/styles/user-item.css";

export default function GroupMember({ member, exclude }) {
  const { userId } = useContext(AuthContext);

  const gotoMember = () => {
    window.location = `/user/${id}`;
  };

  return (
    <div onClick={gotoMember} className="user-item">
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
          <button className="button-neon-red" onClick={(e) => exclude(e)}>
            Исключить
          </button>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
