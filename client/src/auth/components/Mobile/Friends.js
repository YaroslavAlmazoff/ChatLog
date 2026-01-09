import React, { useContext, useEffect, useState } from "react";
import "../../styles/user.css";
import { useParams } from "react-router";
import api from "../../api/auth";
import { AuthContext } from "../../../context/AuthContext";
import FriendItem from "./FriendItem";

const Friends = ({
  userFriends,
  isOwner,
  setUserFriends,
  setNoticeDisplay,
  setNoticeText,
  noticeRef,
}) => {
  const auth = useContext(AuthContext);
  const params = useParams();
  const [friendsButtonDisplay, setFriendsButtonDisplay] = useState("block");
  const [isFriends, setIsFriends] = useState(false);

  useEffect(() => {
    const user2 = params.id;
    if (localStorage.getItem(user2) === auth.userId) {
      setFriendsButtonDisplay("none");
    }
  }, [params, auth]);

  useEffect(() => {
    const checkFriends = async () => {
      const user2 = params.id;
      const response2 = await api.get(`/api/checknotifications/${user2}`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      const response3 = await api.get(`/api/checkfriends/${user2}`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      setIsFriends(response2.data.message);
      setIsFriends(response3.data.message);
    };
    checkFriends();
  }, [params]);

  return (
    <div className="user-friends-mobile">
      <p className="user-friends-title-mobile">Друзья {userFriends.length}</p>
      <div className="user-friends-list-mobile">
        {userFriends.map((el) => (
          <FriendItem
            el={el}
            setUserFriends={setUserFriends}
            userFriends={userFriends}
            setNoticeDisplay={setNoticeDisplay}
            setNoticeText={setNoticeText}
            noticeRef={noticeRef}
          />
        ))}
      </div>
    </div>
  );
};

export default Friends;
