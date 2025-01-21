import React from "react";
import Notification from "./Notification";
import useRandom from "../../common_hooks/random.hook";
import "../styles/notifications.css";

const Notifications = ({
  notifications,
  setNotifications,
  setFriends,
  setNoticeDisplay,
  setNoticeText,
  noticeRef,
}) => {
  const { randomKey } = useRandom();
  return (
    <div>
      <p className="notifications-title">Уведомления</p>
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
