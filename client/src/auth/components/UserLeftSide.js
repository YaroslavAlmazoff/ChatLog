import UserLeftActions from "./UserLeftActions";
import UserFriendsList from "./UserFriendsList";
import UserSubscribesList from "./UserSubscribesList";
import "../styles/user.css";

const UserLeftSide = () => {
  return (
    <div className="user-right-side">
      <UserLeftActions />
      <UserFriendsList />
      <UserSubscribesList />
    </div>
  );
};

export default UserLeftSide;
