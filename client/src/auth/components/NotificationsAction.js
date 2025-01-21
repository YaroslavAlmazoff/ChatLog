import { useContext, useState } from "react";
import CommonModal from "../../common_components/Modal/CommonModal";
import Notifications from "./Notifications";
import { ProfileContext } from "../context/ProfileContext";

const NotificationAction = () => {
  const { notifications, setNotifications, setFriends } =
    useContext(ProfileContext);
  const [showNotifications, setShowNotifications] = useState();
  return (
    <>
      <img
        className={`${
          notifications.length !== 0 &&
          !notifications[notifications.length - 1].checked
            ? "button-neon-red red-block-glow"
            : "button blue-block-glow"
        } notice-img `}
        onClick={() => setShowNotifications(true)}
        width="35"
        src={require("../img/notice.png")}
        alt="notice"
      />
      <CommonModal
        show={showNotifications}
        onClose={() => setShowNotifications(false)}
      >
        <Notifications
          notifications={notifications}
          setNotifications={setNotifications}
          setFriends={setFriends}
        />
      </CommonModal>
    </>
  );
};

export default NotificationAction;
