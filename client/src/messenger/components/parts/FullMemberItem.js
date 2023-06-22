import { useContext } from "react";
import "../../../auth/styles/user-item.css";
import { AuthContext } from "../../../context/AuthContext";
import api from "../../../auth/api/auth";

const FullMemberItem = ({ room, name, surname, avatarUrl, id }) => {
  const auth = useContext(AuthContext);
  const gotoMember = () => {
    window.location = `/user/${id}`;
  };
  const exclude = async (e) => {
    e.stopPropagation();
    await api.delete(`/api/exclude/${room._id}/${id}`, {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    });
  };

  return (
    <div onClick={gotoMember} className="user-item">
      <div className="user-item-right-side">
        <div>
          <img
            className="user-item-img"
            src={process.env.REACT_APP_API_URL + "/useravatars/" + avatarUrl}
            alt="user"
          />
        </div>
        <div className="user-item-info">
          <h3 className="user-item-name">
            {name} {surname}
          </h3>
        </div>
        {auth.userId == room.creator ? (
          <button className="button-neon-red" onClick={(e) => exclude(e)}>
            Исключить
          </button>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default FullMemberItem;
