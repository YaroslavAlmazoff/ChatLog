import { useContext } from "react";
import { ProfileContext } from "../context/ProfileContext";
import { useParams } from "react-router";
import UserSubscribeItem from "./UserSubscribeItem";

const UserSubscribesList = () => {
  const { subscribes, user } = useContext(ProfileContext);
  const params = useParams();
  const goToSubscribes = () => {
    window.location = "/subscribes/" + params.id;
  };
  return (
    <div className="user-friends block">
      <p className="user-friends-title" onClick={goToSubscribes}>
        Подписки {user.subscribesCount}
      </p>
      <div className="user-friends-list">
        {subscribes.map((subscribe) => (
          <UserSubscribeItem subscribe={subscribe} />
        ))}
      </div>
    </div>
  );
};

export default UserSubscribesList;
