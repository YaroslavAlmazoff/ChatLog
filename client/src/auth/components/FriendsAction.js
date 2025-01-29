import { useContext, useState, useEffect } from "react";
import { useParams } from "react-router";
import { AuthContext } from "../../context/AuthContext";
import api from "../api/auth";
import { ProfileContext } from "../context/ProfileContext";

const FriendsAction = () => {
  const { token, userId } = useContext(AuthContext);
  const { hint } = useContext(ProfileContext);
  const params = useParams();

  const [friendsButtonDisplaying, setFriendsButtonDisplaying] = useState(true);
  const [isFriends, setIsFriends] = useState(false);
  const [notificationSent, setNotificationSent] = useState(false);

  useEffect(() => {
    const checkFriends = async () => {
      if (!userId) return;
      const response = await api.get(`/api/check-notifications/${params.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const response2 = await api.get(`/api/check-friends/${params.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotificationSent(response.data.message);
      setIsFriends(response2.data.message);
    };
    checkFriends();
  }, [params, token, userId]);

  const makeFriends = async () => {
    hint("Вы отправили заявку в друзья.");
    await api.get(`/api/make-friends/${params.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setFriendsButtonDisplaying(false);
    setNotificationSent(true);
  };

  if (isFriends) {
    return <h3>У вас в друзьях</h3>;
  } else
    return (
      <>
        {notificationSent && <h3>Вы отправили заявку в друзья</h3>}
        {isFriends && <h3>У Вас в друзьях</h3>}
        {friendsButtonDisplaying ? (
          <button onClick={makeFriends} className="user-action dark-button">
            Добавить в друзья
          </button>
        ) : (
          <></>
        )}
      </>
    );
};

export default FriendsAction;
