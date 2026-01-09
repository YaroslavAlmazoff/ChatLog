import { useContext } from "react";
import { ProfileContext } from "../context/ProfileContext";

const EditProfileAction = () => {
  const { isOwner } = useContext(ProfileContext);
  const gotoEdit = () => {
    window.location = `/editprofile`;
  };
  if (isOwner) {
    return (
      <button onClick={gotoEdit} className="dark-button user-action-button">
        Редактировать профиль
      </button>
    );
  } else return null;
};

export default EditProfileAction;
