import React, { useContext } from "react";
import Notification from "./Notification";
import useRandom from "../../common_hooks/random.hook";
import "../styles/notifications.css";
import { ProfileContext } from "../context/ProfileContext";

const Notifications = ({ setShowNotifications }) => {
  const { randomKey } = useRandom();
  const { notifications } = useContext(ProfileContext);
  return (
    <div>
      <p className="notifications-title">
        Уведомления |{" "}
        <span onClick={() => setShowNotifications(false)} className="pointer">
          Закрыть
        </span>
      </p>
      {notifications.length ? (
        notifications.map((el) => (
          <Notification key={randomKey()} notification={el} />
        ))
      ) : (
        <span>У вас нет уведомлений</span>
      )}
    </div>
  );
};

export default Notifications;
