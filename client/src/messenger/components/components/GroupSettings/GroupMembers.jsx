import { useContext } from "react";
import "../../../styles/GroupMembers.css";
import GroupMember from "./GroupMember";
import { GroupContext } from "../../../context/GroupContext";

export default function GroupMembers() {
  const { room } = useContext(GroupContext);
  return (
    <div className="group-members">
      <span className="group-members-text">
        Участники ({room.members.length})
      </span>
      {room.members.map((member) => (
        <GroupMember member={member} />
      ))}
    </div>
  );
}
