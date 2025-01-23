import { useContext } from "react";
import { ProfileContext } from "../context/ProfileContext";
import FriendsAction from "./FriendsAction";
import MessageAction from "./MessageAction";

const UserLeftActions = () => {
  const { isOwner } = useContext(ProfileContext);
  if (!isOwner) {
    return (
      <div className="user-actions">
        <FriendsAction />
        <MessageAction />
      </div>
    );
  } else return null;
};

export default UserLeftActions;
