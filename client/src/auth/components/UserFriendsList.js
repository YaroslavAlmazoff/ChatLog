import { useParams } from "react-router";
import { useContext } from "react";
import { ProfileContext } from "../context/ProfileContext";
import UserFriendItem from "./UserFriendItem";

const UserFriendsList = () => {
  const { friends, user } = useContext(ProfileContext);
  const params = useParams();
  const goToFriends = () => {
    window.location = "/friends/" + params.id;
  };
  return (
    <div className="user-friends block">
      <p className="user-friends-title" onClick={goToFriends}>
        Друзья {user.friendsCount}
      </p>
      <div className="user-friends-list">
        {friends.map((friend) => (
          <UserFriendItem friend={friend} />
        ))}
      </div>
    </div>
  );
};

export default UserFriendsList;
