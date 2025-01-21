import { useContext } from "react";
import { ProfileContext } from "../context/ProfileContext";

const EditProfileAction = () => {
  const { isOwner } = useContext(ProfileContext);
  const gotoEdit = () => {
    window.location = `/editprofile`;
  };
  return (
    <div className="user-nav-actions">
      {isOwner ? (
        <button onClick={gotoEdit} className="button">
          Редактировать профиль
        </button>
      ) : (
        <></>
      )}
    </div>
  );
};

export default EditProfileAction;
