import { useContext } from "react";
import { ProfileContext } from "../context/ProfileContext";
import AdminAction from "./AdminAction";
import CreatePostAction from "./CreatePostAction";
import EditProfileAction from "./EditProfileAction";
import NotificationAction from "./NotificationsAction";
import PhotoAction from "./PhotoAction";

const UserActions = ({ setShowCreatePostModal }) => {
  if (isOwner) {
    return (
      <div className="center-side-buttons">
        <NotificationAction />
        <EditProfileAction />
        <CreatePostAction setShowModal={setShowCreatePostModal} />
        <AdminAction />
        <PhotoAction />
      </div>
    );
  } else return null;
};

export default UserActions;
