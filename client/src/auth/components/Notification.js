import React, { useContext } from "react";
import "../styles/notifications.css";
import api from "../api/auth";
import Visit from "./Notifications/Visit";
import { useParams } from "react-router";
import Friends from "./Notifications/Friends";
import Simple from "./Notifications/SimpleFriends";
import SimplePosts from "./Notifications/SimplePosts";
import { AuthContext } from "../../context/AuthContext";
import GettingFile from "./Notifications/GettingFile";
import { ProfileContext } from "../context/ProfileContext";

const Notification = ({ notification }) => {
  const { hint, notifications, setNotifications, setUserFriends } =
    useContext(ProfileContext);
  const { token } = useContext(AuthContext);
  const params = useParams();
  const reply = async (itog) => {
    setNotifications(
      [...notifications].filter((el) => el.title !== notification.title)
    );
    await api.delete(`/api/deletenotification/${notification.title}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!itog) {
      hint("Вы отклонили заявку в друзья.");
      return;
    } else {
      hint("Теперь вы друзья");
    }
    await api.get(`/api/reply/${notification.to}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const userdata = await api.get(`/api/user/${params.id}`);
    const friendsID = userdata.data.user.friends;
    let friends = [];
    for (let i = 0; i < friendsID.length; i++) {
      const data = await api.get(`/api/user/${friendsID[i]}`);
      friends.push(data.data.user);
    }
    setUserFriends(friends);
  };
  const gettingFile = async () => {
    await api.get(`/api/getsentfile/${notification._id}`);
    window.location = "/cloud";
  };
  return (
    <div className="notification">
      {notification.type === "friends" ? (
        <Friends
          title={notification.title}
          from={notification.from}
          reply={reply}
        />
      ) : (
        <></>
      )}
      {notification.type === "reply" ||
      notification.type === "delete" ||
      notification.type === "reject" ? (
        <Simple title={notification.title} from={notification.from} />
      ) : (
        <></>
      )}
      {notification.type === "like" || notification.type === "comment" ? (
        <SimplePosts
          title={notification.title}
          postType={notification.postType}
          postID={notification.postID}
        />
      ) : (
        <></>
      )}
      {notification.type === "visit" ? (
        <Visit title={notification.title} from={notification.from} />
      ) : (
        <></>
      )}
      {notification.type === "file" ? (
        <GettingFile
          title={notification.title}
          gettingFile={gettingFile}
          id={notification._id}
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export default Notification;
