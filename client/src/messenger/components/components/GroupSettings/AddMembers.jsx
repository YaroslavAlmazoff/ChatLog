import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../../context/AuthContext";
import useGroupAPI from "../../../hooks/useGroupAPI";
import GroupGoBack from "../GroupGoBack";
import AddingFriendItem from "./AddingFriendItem";
import "../../../styles/GroupSettings.css";

export default function AddMembers() {
  const { getFriends } = useGroupAPI();
  const { userId } = useContext(AuthContext);

  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const getUserFriends = async () => {
      const response = await getFriends(userId);
      setFriends(response.data.friends);
    };

    getUserFriends();
  }, []);

  return (
    <div className="group-settings-part">
      <GroupGoBack />
      {friends.map((friend) => (
        <AddingFriendItem friend={friend} />
      ))}
    </div>
  );
}
