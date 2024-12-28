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
      const data = await getFriends(userId);
      setFriends(data);
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
