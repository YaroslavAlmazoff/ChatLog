import { useEffect, useState } from "react";
import { useParams } from "react-router";
import api from "../../../auth/api/auth";
import Notification from "./components/Notifications";
import "../../styles/notifications.css";

const Notifications = () => {
  const params = useParams();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const getNotifications = async () => {
      const response = await api.get(`/api/public/notifications/${params.id}`);
      console.log(response);
      setNotifications(response.data.notifications);
    };
    getNotifications();
  }, []);

  return (
    <div className="public-notifications block">
      {notifications.map((item) => (
        <Notification item={item} />
      ))}
    </div>
  );
};

export default Notifications;
