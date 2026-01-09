import { useContext, useState } from "react";
import CommonModal from "../../common_components/Modal/CommonModal";
import Notifications from "./Notifications";
import { ProfileContext } from "../context/ProfileContext";

const NotificationAction = () => {
  const { notifications } = useContext(ProfileContext);
  const [showNotifications, setShowNotifications] = useState();
  return (
    <>
      <img
        className={`${
          notifications.length !== 0 &&
          !notifications[notifications.length - 1].checked
            ? "button"
            : "dark-button"
        } blue-block-glow notice-img`}
        onClick={() => setShowNotifications(true)}
        src={require("../img/notice.png")}
        alt="notice"
      />
      <CommonModal
        show={showNotifications}
        onClose={() => setShowNotifications(false)}
      >
        <Notifications setShowNotifications={setShowNotifications} />
      </CommonModal>
    </>
  );
};

export default NotificationAction;
