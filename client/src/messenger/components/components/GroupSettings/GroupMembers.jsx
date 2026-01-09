import { useContext } from "react";
import { GroupContext } from "../../../context/GroupContext";
import GroupMember from "./GroupMember";
import "../../../styles/GroupMembers.css";
import "../../../styles/GroupSettings.css";

export default function GroupMembers() {
  const { room } = useContext(GroupContext);
  return (
    <div className="group-settings-part">
      <span className="group-members-text">
        Участники ({room.members.length})
      </span>
      {room.members.map((member) => (
        <GroupMember member={member} />
      ))}
    </div>
  );
}
