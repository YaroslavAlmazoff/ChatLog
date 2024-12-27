import "../../../styles/GroupMembers.css";
import GroupMember from "./GroupMember";

export default function GroupMembers() {
  const members = [];
  return (
    <div className="group-members">
      <span className="group-members-text">Участники ()</span>
      {members.map((member) => (
        <GroupMember member={member} />
      ))}
    </div>
  );
}
