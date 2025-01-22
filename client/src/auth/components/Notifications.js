import React, { useContext } from "react";
import Notification from "./Notification";
import useRandom from "../../common_hooks/random.hook";
import "../styles/notifications.css";
import { ProfileContext } from "../context/ProfileContext";

const Notifications = ({ setShowNotifications }) => {
  const { randomKey } = useRandom();
  const { notifications, setNotifications, setFriends } =
    useContext(ProfileContext);
  return (
    <div>
      <p className="notifications-title">
        Уведомления |{" "}
        <span onClick={() => setShowNotifications(false)}>Закрыть</span>
      </p>
      {notifications.length ? (
        notifications.map((el) => (
          <Notification
            key={randomKey()}
            id={el._id}
            title={el.title}
            type={el.type}
            from={el.from}
            to={el.to}
            postType={el.postType}
            postID={el.postID}
            notifications={notifications}
            setNotifications={setNotifications}
            setNoticeDisplay={setNoticeDisplay}
            setNoticeText={setNoticeText}
            setFriends={setFriends}
            noticeRef={noticeRef}
          />
        ))
      ) : (
        <span>У вас нет уведомлений</span>
      )}
    </div>
  );
};

export default Notifications;
